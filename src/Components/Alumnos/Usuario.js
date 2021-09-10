import React, { Component } from 'react'
import { connect } from 'react-redux';
import { clearAlumno } from '../../Inicialized/Actions';
import request from 'superagent';

class Usuario extends Component {

    cerrarSesionAlumno() {
        request
            .get('/responseLIGDS/cerrarSesionAlumno')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                }
            });
    }

    cerrarSesion = () => {
        this.props.clearAlumno();
        this.cerrarSesionAlumno()
    };

    renderUsuario() {
        if (!this.props.alumnoAdmin.id) {
            return (
                <span className="textoUsuarioSesion">Inicio de sesión alumnos</span>
            )
        } else {

            return (

                <div className="UsuarioHeader">
                    <img src={require("../../img/sinImagenUsuario.jpg")} alt="" />
                    <span>{this.props.alumnoAdmin.nombre}</span>
                    <div className="button buttonUno buttonDelgado btnCerrarSesion" onClick={this.cerrarSesion}>Cerrar sesión</div>

                </div>

            );

        }
    }

    render() {
        return (
            this.renderUsuario()
        )
    }
}

const mapStateToProps = (state) => {
    return {
        alumnoAdmin: state.alumnoAdmin
    }
}

const mapDispatchToProps = {
    clearAlumno

}

export default connect(mapStateToProps, mapDispatchToProps)(Usuario);