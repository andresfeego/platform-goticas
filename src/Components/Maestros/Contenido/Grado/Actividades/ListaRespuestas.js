import React, { Component } from 'react'
import "./ListaRespuestas.scss"
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast'
import request from 'superagent'

export default class ListaRespuestas extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaRespuestas: []
        }
    }

    componentDidMount() {
        this.getRespuestas()
    }

    getRespuestas() {
        request
            .post('/responseLIGDS/respuestasXactividad')
            .send({ idActividad: this.props.idActividad })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.error, "Error al cargar la información")

                } else {

                    const respuestaLogin = JSON.parse(res.text);

                    console.log(respuestaLogin)
                    this.setState({
                        listaRespuestas: respuestaLogin,
                    })


                }
            });
    }


    renderCalificacion(calificacion, grado) {

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

                switch (calificacion) {
                    case 'D':
                        return <div><span>Calificación: </span><span className="literalCalificacion"> ( D ) Deficiente</span></div>
                        break;

                    case 'I':
                        return <div><span>Calificación: </span><span className="literalCalificacion"> ( I ) Insuficiente</span></div>
                        break;

                    case 'A':
                        return <div><span>Calificación: </span><span className="literalCalificacion"> ( A ) Aceptable</span></div>
                        break;

                    case 'S':
                        return <div><span>Calificación: </span><span className="literalCalificacion"> ( S ) Sobresaliente</span></div>
                        break;

                    case 'E':
                        return <div><span>Calificación: </span><span className="literalCalificacion"> ( E ) Excelente</span></div>
                        break;

                    default:
                        break;
                }

            } else {
                return <div><span>Calificación: </span><span className="literalCalificacion"> {calificacion}</span></div>
            }

        }

    }


    renderRespuesta(item) {
        return (
            <div className="respuestaMaestros">
                <h3>{item.nombreAlumno}</h3>
                {item.calificacion == null ? <span>Sin calificar</span> : this.renderCalificacion(item.calificacion, item.idGrado)}
                <div className="button buttonUno buttonDelgado" onClick={() => this.props.fun.verRespuesta(item)}>Ver</div>
            </div>
        )
    }

    render() {
        return (
            this.state.listaRespuestas.length != 0 ?
                this.state.listaRespuestas.map((item) => this.renderRespuesta(item))
                :
                null
        )
    }
}
