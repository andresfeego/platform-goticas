import React, { Component } from 'react'
import { Input } from '@material-ui/core';
import { tiposAlertas, nuevoMensaje } from "../../Inicialized/Toast";
import request from 'superagent';
import { connect } from 'react-redux';
import { saveAlumno } from '../../Inicialized/Actions';



class PideCorreoTelefono extends Component {

    constructor(props) {
        super(props);

        this.state = {
            correo: this.props.alumnoAdmin.correo,
            telefono: (this.props.alumnoAdmin.telefonoContacto == 0 ? "" : this.props.alumnoAdmin.telefonoContacto)
        }
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    guardar() {

        return new Promise( (resolve, reject) => {
            request
            .post('/responseLIGDS/alumnos/cambiarCorreoTelefono')
            .send({ id: this.props.alumnoAdmin.id, correo: this.state.correo, telefono: this.state.telefono })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
    
                        reject("Error al guardar información")
    
                    } else {
                        resolve()
    
                    }
                });
        })
        
      
    }

    validarInfo() {
        return new Promise((resolve, reject) => {
            if (this.state.correo == "") {
                reject("Debes ingresar un correo para continuar")
            } else {
                var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (!expr.test(this.state.correo)) {
                    reject("El formato de correo es incorrecto Ej: usuario@empresa.com");

                } else {
                    if (this.state.telefono == "") {
                        reject("Debes ingresar un telefono para continuar")
                    } else {
                        var expr = /^([0-9])*$/;

                        if (!expr.test(this.state.telefono)) {
                            reject("El formato de número de telefono es invalido, solo se aceptan números")

                        } else {
                            resolve()
                        }
                    }
                }
            }
        })
    }

    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Creando Alumno")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.props.fun.cambiarEstado(3)

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }

    render() {
        return (
            <div className="Login">
                
                <div className="formularioLogin">
                <span>Hola ! para mejorar nuestra comunicación estamos incluyendo los siguientes datos en tu perfil, ingresalos y dale click en guardar datos.</span>
                    <form onSubmit={this.onSubmit}>
                        <Input className="inputform" type="email" placeholder="Correo electronico" value={this.state.correo} name="correo" onChange={this.onChange} />
                        <Input className="inputform" type="number" placeholder="Telefono de contacto" value={this.state.telefono} name="telefono" onChange={this.onChange} />

                        <div className="button buttonUno" onClick={this.onSubmit}>Guardar datos</div>

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

export default connect(mapStateToProps, mapDispatchToProps)(PideCorreoTelefono);