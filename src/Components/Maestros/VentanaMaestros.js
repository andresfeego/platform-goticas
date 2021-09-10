import React, { Component } from 'react'
import "./VentanaMaestros.scss"
import Login from './Login'
import CambioPass from './CambioPass'
import Contenido from './Contenido/Contenido'
import { connect } from 'react-redux';
import { saveMaestro } from '../../Inicialized/Actions';
import request from 'superagent'
import { nuevoMensaje, tiposAlertas } from '../../Inicialized/Toast'
import Cargando from '../../Inicialized/Cargando'


class VentanaMaestros extends Component {

    constructor(props) {
        super(props);
        var estado = 1
        if (this.props.maestroAdmin.id) {
            estado = 3
        }

        this.state = {
            estado: estado
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.maestroAdmin.id) {
            this.setState({
                estado: 1
            })
        }

    }

    componentDidMount() {
        this.getSesion()
    }

    getSesion() {
        this.setState({ estado: 0 })
        request
            .get('/responseLIGDS/getSessionMaestro')
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
                            const maestro = respuestaLogin[0]
                            this.props.saveMaestro(maestro);
                            this.setState({
                                estado: 3
                            })

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
                return <Contenido fun={this} idUsuario={this.props.maestroAdmin.id} />
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
        maestroAdmin: state.maestroAdmin
    }
}

const mapDispatchToProps = {
    saveMaestro

}


export default connect(mapStateToProps, mapDispatchToProps)(VentanaMaestros);