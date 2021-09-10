import React, { Component } from 'react'
import request from 'superagent'
import Cargando from '../../../../../Inicialized/Cargando'
import "./Alumno.scss"

export default class Alumno extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaRespuestas: "init",
            respuestasAgrupadas: {},
            calificacionAcumulada: "init"
        }
    }

    componentDidMount() {
        this.getRespuestas()
    }


    getRespuestas() {
        request
            .get('/responseLIGDS/respuestasXalumno/' + this.props.alumno.id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);

                    this.setState({
                        listaRespuestas: respuestaLogin,
                    }, this.agruparREspuestas(respuestaLogin))


                }
            });
    }

    agruparREspuestas(lista) {

        lista.map((respuesta) => {
            if (!this.state.respuestasAgrupadas[respuesta.idActividad]) {
                var resp = this.state.respuestasAgrupadas
                resp[respuesta.idActividad] = [respuesta]
                this.setState({
                    respuestasAgrupadas: resp
                })

            } else {
                var resp = this.state.respuestasAgrupadas
                resp[respuesta.idActividad].push(respuesta)
                this.setState({
                    respuestasAgrupadas: resp
                })
            }

        })
    }

    renderCalificacion(calificacion, grado) {
        if (calificacion != null) {


            if (grado == 1 || grado == 2) {
                if (calificacion == '1') {
                    return (
                        <div className="calificacionEmoji">
                            <span>Calificación: </span>
                            <img className="emojiCalifi emojiFeliz" src={require("../../../../../img/emoji-feliz.png")} alt="" />
                        </div>
                    )
                } else {
                    return (
                        <div className="calificacionEmoji">
                            <span>Calificación: </span>
                            <img className="emojiCalifi emojiTriste" src={require("../../../../../img/emoji-triste.jpg")} alt="" />
                        </div>
                    )
                }
            } else {
                if (grado == 3 || grado == 4 || grado == 5) {
                    return <span className="respuCalTres">{calificacion}</span>

                } else {
                    return <span className="respuCalTres">{calificacion}</span>

                }

            }
        } else {
            return <span className="respuCalCuatro">Sin calificar</span>
        }

    }


    renderRespuestas() {
        return (

            this.state.listaRespuestas.map((respuesta) =>
                <div className="listaRespuestas">
                    <div className="activi">
                        {respuesta.nomActividad}
                    </div>
                    <div className="respu">
                        {this.state.respuestasAgrupadas[respuesta.idActividad].map((respuestaAct, index) =>
                            <div className="respuCal">
                                <span className="respuCalUno">{"Respuesta " + (index + 1)}</span>
                                <span className="respuCalDos">{respuestaAct.descripcion}</span>
                                {this.renderCalificacion(respuesta.calificacion, respuesta.idGrado)}
                            </div>
                        )}
                    </div>
                </div>

            )
        )
    }

    render() {
        const alumno = this.props.alumno
        return (
            <div className="alumnoMaestros">
                <div className="nombre">{alumno.nombre + " " + alumno.apellidos}</div>
                {this.state.listaRespuestas != "init" ?
                    <div className="actividadesYcalificaciones">
                        {this.state.respuestasAgrupadas != {} ?
                            this.renderRespuestas()
                            :
                            null
                        }
                    </div>
                    :
                    <Cargando />}

            </div>
        )
    }
}
