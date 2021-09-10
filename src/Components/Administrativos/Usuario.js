import React, { Component } from 'react'
import { connect } from 'react-redux';
import request from 'superagent';
import { clearUsuarioAdmin } from '../../Inicialized/Actions';

class Usuario extends Component {


    componentDidMount() {
        console.log(this.props.usuarioAdmin)
    }

    cerrarSesionUsuAdmin() {
        request
            .get('/responseLIGDS/cerrarSesionUsuAdmin')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                }
            });
    }

    cerrarSesion = () => {
        this.props.clearUsuarioAdmin();
        this.cerrarSesionUsuAdmin()
    };

    renderUsuario() {
        if (!this.props.usuarioAdmin.id) {
            return (
                <span className="textoUsuarioSesion">Inicio de sesión administrativos</span>
            )
        } else {

            return (

                <div className="UsuarioHeader">
                    <img src={require("../../img/sinImagenUsuario.jpg")} alt="" />
                    <span>{this.props.usuarioAdmin.nombre}</span>
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
        usuarioAdmin: state.usuarioAdmin
    }
}

const mapDispatchToProps = {
    clearUsuarioAdmin

}

export default connect(mapStateToProps, mapDispatchToProps)(Usuario);