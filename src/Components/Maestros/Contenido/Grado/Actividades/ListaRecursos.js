import React, { Component } from 'react'
import "./ListaRecursos.scss"
import Recurso from './Recurso'
import request from 'superagent'
import { tiposAlertas, nuevoMensaje } from '../../../../../Inicialized/Toast'
import AgregarRecurso from './AgregarRecurso'

export default class ListaRecursos extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaRecursos: [],
            listaVacia: 0
        }
    }

    componentDidMount() {
        this.getRecursos()
    }

    getRecursos() {

        nuevoMensaje(tiposAlertas.cargando, "Cargando lista de recursos para la actividad")
        request
            .get('/responseLIGDS/recursoXactividad/' + this.props.idActividad)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.cargadoWarn, "No hay recursos para esta actividad")
                        this.setState({
                            listaRecursos: [],
                        })
                        this.props.fun.setNumRecursos(respuestaLogin.length)
                    } else {
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Recursos cargados")
                        this.setState({
                            listaRecursos: respuestaLogin,
                        })
                        this.props.fun.setNumRecursos(respuestaLogin.length)
                    }
                }
            });
    }


    render() {
        return (
            <div className="listaRecursos">
                <div className="contenidoRecursos">

                    {this.state.listaRecursos.length != 0 ?
                        this.state.listaRecursos.map((item) => <Recurso item={item} fun={this} />)
                        :
                        null
                    }

                </div>
                <AgregarRecurso idActividad={this.props.idActividad} fun={this} />
            </div>
        )
    }
}
