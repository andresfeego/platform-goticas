import React, { Component } from 'react'
import { connect } from 'react-redux';
import { saveAlumno } from '../../Inicialized/Actions';
import Login from './Login'
import CambioPass from './CambioPass'
import Contenido from './Contenido/Contenido'
import PideCorreoTelefono from './PideCorreoTelefono';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../Inicialized/Toast';
import Cargando from '../../Inicialized/Cargando';

class VentanaAlumnos extends Component {

    constructor(props) {
        super(props);
        var estado = 1
        if (this.props.alumnoAdmin.id) {
            estado = 3
        }

        if (this.props.alumnoAdmin.correo == null || this.props.alumnoAdmin.correo == "" || this.props.alumnoAdmin.correo == 0 || this.props.alumnoAdmin.telefonoContacto == null || this.props.alumnoAdmin.telefonoContacto == "" || this.props.alumnoAdmin.telefonoContacto == 0) {
            estado = 4
        }

        this.state = {
            estado: estado
        }
    }

    componentWillReceiveProps(nextProps) {
        var estado = 1
        if (!nextProps.alumnoAdmin.id) {
            this.setState({
                estado: estado
            })
        }

    }

    componentDidMount() {
        this.getSesion()
    }

    getSesion() {
        this.setState({ estado: 0 })
        request
            .get('/responseLIGDS/getSessionAlumno')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    this.setState({
                        estado: 1
                    })
                } else {


                    if (res.text == "sin usuario") {
                        this.setState({
                            estado: 1
                        })
                    } else {

                        try {
                            const respuestaLogin = JSON.parse(res.text);
                            const alumno = respuestaLogin[0]
                            this.props.saveAlumno(alumno);
                            if (this.props.alumnoAdmin.correo == null || this.props.alumnoAdmin.correo == "" || this.props.alumnoAdmin.correo == 0 || this.props.alumnoAdmin.telefonoContacto == null || this.props.alumnoAdmin.telefonoContacto == "" || this.props.alumnoAdmin.telefonoContacto == 0) {
                                this.setState({
                                    estado: 4
                                })
                            } else {

                                this.setState({
                                    estado: 3
                                })
                            }

                        } catch (error) {
                            nuevoMensaje(tiposAlertas.warn, res.text)
                            this.setState({
                                estado: 1
                            })

                        }
                    }

                }
            });
    }


    cambiarEstado(estado) {
        this.setState({
            estado: estado
        })
    }

    renderVentana() {
        switch (this.state.estado) {
            case 1:
                return <Login fun={this} />
                break;

            case 2:
                return <CambioPass fun={this} />
                break;

            case 3:
                return <Contenido fun={this} alumno={this.props.alumnoAdmin} />
                break;

            case 4:
                return <PideCorreoTelefono fun={this} />
                break;

            default:
                return <Cargando />
                break;
        }
    }

    render() {
        return (
            this.renderVentana()
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

export default connect(mapStateToProps, mapDispatchToProps)(VentanaAlumnos);