import React, { Component } from 'react'
import request from 'superagent'
import { tiposAlertas, nuevoMensaje } from '../../../../Inicialized/Toast'
import AgregarRecursoRespuesta from './AgregarRecursoRespuesta'
import Recurso from './Recurso'


export default class ListaRecursos extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaRecursos: []
        }
    }

    componentDidMount() {
        this.getRecursos()
    }

    getRecursos() {

        nuevoMensaje(tiposAlertas.cargando, "Cargando lista de recursos para la respuesta")
        request
            .get('/responseLIGDS/recursoXrespuesta/' + this.props.idRespuesta)
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
                <AgregarRecursoRespuesta idRespuesta={this.props.idRespuesta} fun={this} />
            </div>
        )
    }
}
