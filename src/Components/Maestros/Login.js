import React, { Component } from 'react'
import "./Login.scss"
import { Input } from '@material-ui/core';
import { tiposAlertas, nuevoMensaje } from "../../Inicialized/Toast";
import request from 'superagent';
import { connect } from 'react-redux';
import { saveMaestro } from '../../Inicialized/Actions';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: this.props.email,
            password: this.props.pass
        }
    }


    guardarSesionMAestro(maestro) {
        request
            .post('/responseLIGDS/guardarSesionMaestro')
            .send({ pass: this.state.password, id: maestro.correo })
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
            .get('/responseLIGDS/profesor/' + this.state.email)
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
                        const maestro = respuestaLogin[0];
                        if (maestro.pass == this.state.password) {
                            nuevoMensaje(tiposAlertas.cargadoSuccess, "Credenciales correctas", 1000);

                            if (maestro.pass == maestro.id) {
                                nuevoMensaje(tiposAlertas.warn, "Tienes la contraseña por defecto del sistema, debes cambiarla antes de continuar")
                                setTimeout(function () {
                                    this.props.fun.cambiarEstado(2);
                                    this.props.saveMaestro(maestro);

                                }.bind(this), 1000);
                            } else {
                                this.guardarSesionMAestro(maestro)
                                setTimeout(function () {
                                    this.props.fun.cambiarEstado(3);
                                    this.props.saveMaestro(maestro);

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
        if (this.state.email == "") {
            nuevoMensaje(tiposAlertas.error, "Ingrese un usuario");
        } else {
            if (this.state.password == "") {
                nuevoMensaje(tiposAlertas.error, "Ingrese una contraseña");
            } else {
                var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                if (!expr.test(this.state.email)) {
                    nuevoMensaje(tiposAlertas.error, "formato de correo incorrecto Ej: usuario@empresa.com");
                } else {
                    this.login();
                }

            }
        }


    }

    render() {
        return (
            <div className="Login">
                <div className="formularioLogin">
                    <img src={require("../../img/candado.png")} alt="" />
                    <form onSubmit={this.onSubmit}>
                        <Input className="inputform" type="email" placeholder="E-mail" value={this.state.email} name="email" onChange={this.onChange} />
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
        maestroAdmin: state.maestroAdmin
    }
}

const mapDispatchToProps = {
    saveMaestro

}

export default connect(mapStateToProps, mapDispatchToProps)(Login);