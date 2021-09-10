import React, { Component } from 'react'
import "./Usuario.scss"
import { connect } from 'react-redux';
import { clearMaestro } from '../../Inicialized/Actions';
import request from 'superagent';

class Usuario extends Component {



    cerrarSesionMaestro() {
        request
            .get('/responseLIGDS/cerrarSesionMaestro')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                }
            });
    }

    cerrarSesion = () => {
        this.cerrarSesionMaestro()
        this.props.clearMaestro();
    };

    renderUsuario() {
        if (!this.props.maestroAdmin.id) {
            return (
                <span className="textoUsuarioSesion">Inicio de sesión maestros</span>
            )
        } else {

            return (

                <div className="UsuarioHeader">
                    <img src={require("../../img/sinImagenUsuario.jpg")} alt="" />
                    <span>{this.props.maestroAdmin.nombre + " " + this.props.maestroAdmin.apellido}</span>
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
        maestroAdmin: state.maestroAdmin
    }
}

const mapDispatchToProps = {
    clearMaestro

}

export default connect(mapStateToProps, mapDispatchToProps)(Usuario);