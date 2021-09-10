import React, { Component } from 'react'
import { Input } from '@material-ui/core';
import {  tiposAlertas, nuevoMensaje } from "../../Inicialized/Toast";
import request from 'superagent';
import {connect} from 'react-redux';
import { saveAlumno } from '../../Inicialized/Actions';

class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            id: '',
            password: ''
        }
    }

    guardarSesionAlumno(alumno){
        request
                .post('/responseLIGDS/guardarSesionAlumno')
                .send({pass: this.state.password, id: alumno.usuario})
                .set('accept', 'json')
                .end((err, res) => {
                        if (err) {
                            console.log(err);

                        } else {
                            console.log(res.text )  
                        }
                });
    }

    login (){
        nuevoMensaje(tiposAlertas.cargando,"Validando...");
        request
            .get('/responseLIGDS/alumnoXid/'+this.state.id)
            .set('accept', 'json')
            .end((err, res) => {
                    
                if (err) {
                    console.log(err);
                            nuevoMensaje(tiposAlertas.cargadoError, "Error al consultar usuario: "+err,1000);

                } else {
                    const respuestaLogin =   JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.cargadoError, "Usuario no encontrado");
                    } else {
                        const alumno =  respuestaLogin[0];

                        if (alumno.activo == 0) {

                            nuevoMensaje(tiposAlertas.cargadoError, "Usuario desactivado");

                        } else {

                            if (alumno.pass == this.state.password) {
                                nuevoMensaje(tiposAlertas.cargadoSuccess,"Credenciales correctas",1000);
                                
                                if (alumno.pass == alumno.usuario) {
                                    nuevoMensaje(tiposAlertas.warn, "Tienes la contraseña por defecto del sistema, debes cambiarla antes de continuar")
                                    setTimeout(function() {
                                        this.props.fun.cambiarEstado(2);
                                        this.props.saveAlumno(alumno);
                                         
                                     }.bind(this), 1000);
                                } else {
                                    this.guardarSesionAlumno(alumno)
                                    setTimeout(function() {
                                        this.props.saveAlumno(alumno);
                                        if (alumno.correo == null || alumno.correo == "" || alumno.correo == 0 || alumno.telefonoContacto == null || alumno.telefonoContacto == "" || alumno.telefonoContacto == 0) {
                                            this.props.fun.cambiarEstado(4);
                                        }else{
                                            this.props.fun.cambiarEstado(3);
                                        }
                                         
                                     }.bind(this), 1000);
                                }
                                
                            }else {
                                nuevoMensaje(tiposAlertas.cargadoError, "Contraseña incorrecta");
                                this.setState({
                                    password: ""
                                })
                            }
                        }
                        
                    }
                }


            });
    }

    onChange = e =>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    onSubmit = e => {
        e.preventDefault();
        if (this.state.id == "") {
            nuevoMensaje(tiposAlertas.error,"Ingrese un usuario");
        }else{
            if (this.state.password == "") {
                nuevoMensaje(tiposAlertas.error,"Ingrese una contraseña");
            }else{
                this.login();

            }
        }

        
    }

    render() {
        return (
            <div className="Login">
                <div className="formularioLogin">
                <img src={require("../../img/candado.png")} alt="" />

                    <form onSubmit={this.onSubmit}>
                        <Input className="inputform" type="text" placeholder="usuario" value={this.state.id} name="id" onChange={this.onChange}/>
                        <Input className="inputform" type="password" placeholder="Contraseña" value={this.state.password} name="password" onChange={this.onChange}/>
                        <Input className="inputform buttonUno" type="submit"/>
                    </form>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        alumnoAdmin: state.alumnoAdmin
    }
}

const mapDispatchToProps = {
    saveAlumno
	
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);