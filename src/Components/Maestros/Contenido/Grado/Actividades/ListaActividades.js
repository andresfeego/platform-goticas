import React, { Component } from 'react'
import "./ListaActividades.scss"
import AgregarActividad from './AgregarActividad'
import VistaActividad from './VistaActividad'
import VistaRespuesta from './VistaRespuesta'

import Actividad from './Actividad'
import request from 'superagent'
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast'

export default class ListaActividades extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaActividades: [],
            menu: 1,
            currentActividad: 0,
            respuesta: 0
        }
    }

    componentDidMount() {
        this.getActividdades(this.props.materia.id)
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {

            this.props.fun.cambiaContenido(1)
            this.props.fun.cambiarMateria(null)
            this.props.fun.getMaterias(this.props.idGrado)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.getActividdades(nextProps.materia.id)
    }

    getActividdades(idMateria) {
        nuevoMensaje(tiposAlertas.cargando, "Cargando lista de actividades")
        request
            .get('/responseLIGDS/actividadesXmateria/' + idMateria)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.cargadoWarn, "No hay actividades para este materia")
                        this.setState({
                            listaActividades: [],
                        })
                    } else {
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Lista de actividades cargada")
                        this.setState({
                            listaActividades: respuestaLogin,
                        })
                    }
                }
            });
    }

    renderLista() {
        return (
            <div className="listaActividades">
                <div className="button buttonUno buttonDelgado" onClick={() => this.Atras()}>{" <=  Atras"}</div>
                <h1 className="tituloMateria" >{this.props.materia.nombre}</h1>
                <AgregarActividad nombreGrado={this.props.nombreGrado} idGrado={this.props.idGrado} materia={this.props.materia} fun={this} />
                {this.state.listaActividades.map((item) => <Actividad item={item} materia={this.props.materia} key={item.id} idGrado={this.props.idGrado} fun={this} />)}
            </div>

        )
    }

    cambiaContenido(menu) {
        this.setState({
            menu: menu
        })
    }

    cambiarActividad(idActividad) {
        this.setState({
            currentActividad: idActividad
        })
    }

    cambiarRespuesta(respuesta) {
        this.setState({
            respuesta: respuesta
        })
    }

    Atras() {
        this.props.fun.cambiaContenido(1)
        this.props.fun.cambiarMateria(null)
        this.props.fun.getMaterias(this.props.idGrado)
    }

    renderContenido() {
        switch (this.state.menu) {
            case 1:
                return (
                    this.state.listaActividades.length != 0 ?
                        this.renderLista()
                        :
                        <div className="listaActividades">
                            <div className="button buttonUno buttonDelgado" onClick={() => this.Atras()}>{" <=  Atras"}</div>
                            <AgregarActividad nombreGrado={this.props.nombreGrado} idGrado={this.props.idGrado} materia={this.props.materia} fun={this} />
                        </div>
                )

                break;

            case 2:
                return (

                    <div className="listaActividades">
                        <VistaActividad idActividad={this.state.currentActividad} materia={this.props.materia} fun={this} />
                    </div>
                )

                break;

            case 3:
                return (

                    <div className="listaActividades">
                        <VistaRespuesta respuesta={this.state.respuesta} fun={this} />
                    </div>
                )

                break;

            default:
                break;
        }
    }


    render() {
        return (

            this.renderContenido()

        )
    }
}
