import React, { Component } from 'react'
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast';
import VideoPlayer from 'react-simple-video-player';
import CalificarRespuesta from './CalificarRespuesta';

export default class VistaRespuesta extends Component {



    constructor(props) {
        super(props)

        this.state = {
            listaEvidencias: []
        };
    };



    componentDidMount() {
        this.getEvidencias()
    }

    getEvidencias() {

        request
            .get('/responseLIGDS/recursoXrespuesta/' + this.props.respuesta.id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.warn, "No hay recursos para esta actividad")
                        this.setState({
                            listaEvidencias: [],
                        })
                    } else {
                        nuevoMensaje(tiposAlertas.success, "Recursos cargados")
                        this.setState({
                            listaEvidencias: respuestaLogin,
                        })
                    }
                }
            });
    }


    Atras() {
        this.props.fun.cambiaContenido(2)
    }

    renderEvidencia(item, index) {
        index++
        switch (item.tipo) {
            case 1:


                return (
                    <div className="recurso">
                        <h2 className="titulo">{"Recurso " + index}</h2>
                        <span>{item.descripcion}</span>
                        <VideoPlayer url={"../../../../../recursosRespuesta/videos/" + item.link} />

                    </div>
                )

                break;



            case 2:
                return (
                    <div className="recurso">
                        <h2 className="titulo">{"Recurso " + index}</h2>
                        <span>{item.descripcion}</span>
                        <a href={"../../../../../recursosRespuesta/documentos/" + item.link} target="_blanck" className="button buttonUno buttonDelgado">Abrir Pdf</a>

                    </div>
                )
                break;


            case 3:
                return (
                    <div className="recurso">
                        <h2 className="titulo">{"Recurso " + index}</h2>
                        <span>{item.descripcion}</span>
                        <img className="mediaRecurso" src={"/recursosRespuesta/imagenes/" + item.link} alt="" />

                    </div>
                )
                break;


            default:
                break;
        }
    }

    renderListaEvidencias() {
        return this.state.listaEvidencias.map((item, index) => this.renderEvidencia(item, index))
    }

    renderRespuesta() {
        var respuesta = this.props.respuesta
        return (
            <div className="contenidoActividad">
                <h1>{respuesta.nombreAlumno}</h1>
                <span>{respuesta.descripcion}</span>

                {this.state.listaEvidencias.length != 0 ?
                    this.renderListaEvidencias()
                    :
                    null
                }
            </div>
        )
    }


    render() {
        return (
            <div className="vistaActividad">
                <div className="button buttonUno buttonDelgado" onClick={() => this.Atras()}>{" <== Atras"}</div>

                {this.props.respuesta != null ?
                    this.renderRespuesta()
                    :
                    null
                }

                <CalificarRespuesta respuesta={this.props.respuesta} />

            </div>
        )
    }
}
