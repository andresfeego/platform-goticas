import React, { Component } from 'react'
import { Input } from '@material-ui/core';
import { tiposAlertas, nuevoMensaje } from "../../Inicialized/Toast";
import request from 'superagent';
import { connect } from 'react-redux';
import { saveUsuarioAdmin } from '../../Inicialized/Actions';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            password: ''
        }
    }

    guardarSesionUsuAdmin(usuario) {
        request
            .post('/responseLIGDS/guardarSesionUsuAdmin')
            .send({ pass: this.state.password, id: usuario.correo })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log(res.text)
                }
            });
    }

    login() {
        nuevoMensaje(tiposAlertas.cargando, "Validando...");
        request
            .get('/responseLIGDS/usuarioXcorreo/' + this.state.id)
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al consultar usuario: " + err, 1000);

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.cargadoWarn, "Usuario no encontrado o desactivado");
                    } else {
                        const usuario = respuestaLogin[0];


                        if (usuario.pass == this.state.password) {
                            nuevoMensaje(tiposAlertas.cargadoSuccess, "Credenciales correctas", 1000);

                            if (usuario.pass == usuario.passTemp) {
                                nuevoMensaje(tiposAlertas.warn, "Tienes la contraseña por defecto del sistema, debes cambiarla antes de continuar")
                                setTimeout(function () {
                                    this.props.fun.cambiarEstado(2);
                                    this.props.saveUsuarioAdmin(usuario);

                                }.bind(this), 1000);
                            } else {
                                this.guardarSesionUsuAdmin(usuario)
                                setTimeout(function () {
                                    this.props.fun.cambiarEstado(3);
                                    this.props.saveUsuarioAdmin(usuario);

                                }.bind(this), 1000);
                            }

                        } else {
                            nuevoMensaje(tiposAlertas.cargadoError, "Contraseña incorrecta");
                            this.setState({
                                password: ""
                            })
                        }
                    }
                }


            });
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    onSubmit = e => {
        e.preventDefault();
        if (this.state.id == "") {
            nuevoMensaje(tiposAlertas.error, "Ingrese un usuario");
        } else {
            if (this.state.password == "") {
                nuevoMensaje(tiposAlertas.error, "Ingrese una contraseña");
            } else {
                this.login();

            }
        }


    }

    render() {
        return (
            <div className="Login">
                <div className="formularioLogin">
                    <form onSubmit={this.onSubmit}>
                        <Input className="inputform" type="text" placeholder="usuario" value={this.state.id} name="id" onChange={this.onChange} />
                        <Input className="inputform" type="password" placeholder="Contraseña" value={this.state.password} name="password" onChange={this.onChange} />
                        <Input className="inputform buttonUno" type="submit" />
                    </form>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        saveUsuarioAdmin: state.saveUsuarioAdmin
    }
}

const mapDispatchToProps = {
    saveUsuarioAdmin

}

export default connect(mapStateToProps, mapDispatchToProps)(Login);