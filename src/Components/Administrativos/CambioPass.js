import React, { Component } from 'react'

import { Input } from '@material-ui/core';
import { tiposAlertas, nuevoMensaje } from "../../Inicialized/Toast";
import request from 'superagent';
import { connect } from 'react-redux';
import { saveUsuarioAdmin } from '../../Inicialized/Actions';



class CambioPass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            password1: '',
            password2: ''
        }
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    guardarSesionUsuAdmin(usuario) {
        request
            .post('/responseLIGDS/guardarSesionUsuAdmin')
            .send({ pass: this.state.password1, id: usuario.correo })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log(res.text)
                }
            });
    }

    cambiarContrasena() {
        request
            .post('/responseLIGDS/usuarioSistema/cambiarContrasena')
            .send({ pass: this.state.password1, id: this.props.usuarioAdmin.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    nuevoMensaje(tiposAlertas.success, "Se ha registrado la información")
                    this.guardarSesionUsuAdmin(this.props.usuarioAdmin)
                    this.props.fun.cambiarEstado(3);
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
        usuarioAdmin: state.usuarioAdmin
    }
}

const mapDispatchToProps = {

    saveUsuarioAdmin

}

export default connect(mapStateToProps, mapDispatchToProps)(CambioPass);