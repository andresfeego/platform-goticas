import React, { Component } from 'react'
import { Input } from '@material-ui/core';
import { tiposAlertas, nuevoMensaje } from "../../Inicialized/Toast";
import request from 'superagent';
import { connect } from 'react-redux';
import { saveAlumno } from '../../Inicialized/Actions';



class CambioPass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            password1: '',
            password2: ''
        }
    }

    guardarSesionAlumno(alumno) {
        request
            .post('/responseLIGDS/guardarSesionAlumno')
            .send({ pass: this.state.password1, id: alumno.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log(res.text)
                }
            });
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    cambiarContrasena() {
        request
            .post('/responseLIGDS/alumnos/cambiarContrasena')
            .send({ pass: this.state.password1, id: this.props.alumnoAdmin.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    nuevoMensaje(tiposAlertas.success, "Se ha registrado la información")
                    this.guardarSesionAlumno(this.props.alumnoAdmin)
                    if (this.props.alumnoAdmin.correo == null || this.props.alumnoAdmin.correo == "" || this.props.alumnoAdmin.correo == 0 || this.props.alumnoAdmin.telefonoContacto == null || this.props.alumnoAdmin.telefonoContacto == "" || this.props.alumnoAdmin.telefonoContacto == 0) {
                        this.props.fun.cambiarEstado(4);
                    } else {
                        this.props.fun.cambiarEstado(3);
                    }
                }
            });
    }

    onSubmit = e => {
        e.preventDefault();
        if (this.state.password1 == '') {
            nuevoMensaje(tiposAlertas.error, "Ingresa tu contraseña");
        } else {
            if (this.state.password2 == '') {
                nuevoMensaje(tiposAlertas.error, "Repite tu contraseña");
            } else {


                if (this.state.password1 != this.state.password2) {
                    nuevoMensaje(tiposAlertas.error, "Las contraseñas no coinciden");
                } else {
                    this.cambiarContrasena();
                }

            }
        }


    }


    render() {
        return (
            <div className="Login">
                <div className="formularioLogin">
                    <form onSubmit={this.onSubmit}>
                        <Input className="inputform" type="password" placeholder="Nueva contraseña" value={this.state.password1} name="password1" onChange={this.onChange} />
                        <Input className="inputform" type="password" placeholder="Repite nueva contraseña" value={this.state.password2} name="password2" onChange={this.onChange} />
                        {this.state.password1 != this.state.password2 && this.state.password1 != '' && this.state.password2 != '' ? <span style={{ color: "red" }}>No son identicas !</span> : null}
                        <div className="button buttonUno" onClick={this.onSubmit}>Cambiar Contraseña</div>

                    </form>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        alumnoAdmin: state.alumnoAdmin
    }
}

const mapDispatchToProps = {
    saveAlumno

}

export default connect(mapStateToProps, mapDispatchToProps)(CambioPass);