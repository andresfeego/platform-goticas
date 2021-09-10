import React, { Component } from 'react'
import "./VistaActividad.scss"
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast'
import request from 'superagent'
import YouTube from 'react-youtube';
import AgregarRecurso from './AgregarRecurso'
import { connect } from 'react-redux';
import Respuesta from './Respuesta'


class VistaActividad extends Component {


    constructor(props) {
        super(props)

        this.state = {
            actividad: null,
            listaRecursos: [],
            listaRespuestas: []
        }
    }

    componentDidMount() {
        this.getActividad()
        this.getRecursos()
        this.getRespuestas()
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

    getRespuestas() {
        request
            .post('/responseLIGDS/respuestasXalumnoXactividad')
            .send({ idActividad: this.props.idActividad, idAlumno: this.props.alumnoAdmin.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);

                    console.log(respuestaLogin)
                    this.setState({
                        listaRespuestas: respuestaLogin,
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
                        <a href={"../../../../recursosActividad/guias/" + item.link} className="button buttonUno buttonDelgado">Abrir Pdf</a>

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

    renderActividad(actividad) {
        return (
            <div className="contenidoActividad">
                <h1>{actividad.nombre}</h1>
                <span className="tituloMateria" >{this.props.materia.nombre}</span>
                <span>{actividad.descripcion}</span>

                {this.state.listaRecursos.length != 0 ?
                    this.renderListaRecursos()
                    :
                    null
                }
            </div>
        )
    }

    Atras() {
        this.props.fun.cambiarMenu(1)
        this.props.fun.cambiaActividad(0)
    }

    render() {
        var actividad = this.state.actividad
        return (
            <div className="vistaActividad">
                <div className="button buttonUno buttonDelgado" onClick={() => this.Atras()}>{" <== Atras"}</div>

                {this.state.actividad != null ?
                    [this.renderActividad(actividad),

                    this.state.listaRespuestas.length != 0 ?
                        this.state.listaRespuestas.map((item, index) => <Respuesta item={item} index={index} usuario={this.props.alumnoAdmin} />)
                        :
                        null


                        , <AgregarRecurso idActividad={actividad.id} fun={this} />
                    ]
                    :
                    null
                }

            </div>
        )
    }
}





const mapStateToProps = (state) => {
    return {
        alumnoAdmin: state.alumnoAdmin
    }
}


export default connect(mapStateToProps)(VistaActividad);