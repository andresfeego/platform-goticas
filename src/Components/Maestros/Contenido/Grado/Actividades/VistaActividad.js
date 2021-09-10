import React, { Component } from 'react'
import "./VistaActividad.scss"
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast'
import request from 'superagent'
import YouTube from 'react-youtube';
import ListaRespuestas from './ListaRespuestas'


export default class VistaActividad extends Component {


    constructor(props) {
        super(props)

        this.state = {
            actividad: null,
            listaRecursos: []
        }
    }

    componentDidMount() {
        this.getActividad()
        this.getRecursos()
    }

    getActividad() {
        nuevoMensaje(tiposAlertas.cargando, "Cargando actividad", 10000)
        request
            .get('/responseLIGDS/actividadXid/' + this.props.idActividad)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al cargar la información")

                } else {

                    const respuestaLogin = JSON.parse(res.text);

                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Actividad cargada")
                    this.setState({
                        actividad: respuestaLogin[0],
                    })


                }
            });
    }

    getRecursos() {

        request
            .get('/responseLIGDS/recursoXactividad/' + this.props.idActividad)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            listaRecursos: [],
                        })
                    } else {
                        this.setState({
                            listaRecursos: respuestaLogin,
                        })
                    }
                }
            });
    }



    renderRecurso(item, index) {
        index++
        switch (item.tipo) {
            case 1:
                const opts = {

                    playerVars: {
                        // https://developers.google.com/youtube/player_parameters
                        autoplay: 0,
                    },
                };

                var video_id = item.link.split('.be/')[1];

                if (video_id) {
                    var ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                    }
                } else {
                    video_id = item.link.split('v=')[1];
                    var ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                    }
                }

                return (
                    <div className="recurso">
                        <h2 className="titulo">{"Recurso " + index}</h2>
                        <span>{item.descripcion}</span>
                        <YouTube videoId={video_id} opts={opts} className="mediaRecurso" onReady={this._onReady} />

                    </div>
                )

                break;



            case 2:
                return (
                    <div className="recurso">
                        <h2 className="titulo">{"Recurso " + index}</h2>
                        <span>{item.descripcion}</span>
                        <a href={"../../../../../recursosActividad/guias/" + item.link} target="_blanck" className="button buttonUno buttonDelgado">Abrir Pdf</a>

                    </div>
                )
                break;


            case 3:
                return (
                    <div className="recurso">
                        <h2 className="titulo">{"Recurso " + index}</h2>
                        <span>{item.descripcion}</span>
                        <img className="mediaRecurso" src={"/recursosActividad/imagenes/" + item.link} alt="" />

                    </div>
                )
                break;


            default:
                break;
        }
    }

    renderListaRecursos() {
        return this.state.listaRecursos.map((item, i) => this.renderRecurso(item, i))
    }



    Atras() {
        this.props.fun.cambiarActividad(0)
        this.props.fun.cambiaContenido(1)
    }

    verRespuesta(respuesta) {
        this.props.fun.cambiarRespuesta(respuesta)
        this.props.fun.cambiaContenido(3)
    }

    renderActividad(actividad) {
        return (
            <div className="contenidoActividad">
                <span className="tituloMateria" >{this.props.materia.nombre}</span>
                <h1>{actividad.nombre}</h1>
                <span>{actividad.descripcion}</span>

                {this.state.listaRecursos.length != 0 ?
                    this.renderListaRecursos()
                    :
                    null
                }
                <ListaRespuestas idActividad={actividad.id} fun={this} />
            </div>
        )
    }

    render() {
        var actividad = this.state.actividad
        return (
            <div className="vistaActividad">
                <div className="button buttonUno buttonDelgado" onClick={() => this.Atras()}>{" <== Atras"}</div>
                {this.state.actividad != null ?
                    this.renderActividad(actividad)
                    :
                    null
                }

            </div>
        )
    }
}
