import React, { Component } from 'react'
import "./Respuesta.scss"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ListaRecursos from './ListaRecursos';

export default class Respuesta extends Component {

    constructor(props) {
        super(props)

        this.state = {
            verRecursos: false
        };
    };


    verRecursos() {
        this.setState({
            verRecursos: !this.state.verRecursos
        })
    }

    renderCalificacion(calificacion) {
        var grado = this.props.usuario.idGrado

        if (grado == 1 || grado == 2) {
            if (calificacion == '1') {
                return (
                    <div >
                        <span>Calificación: </span>
                        <img className="emojiCalifi" src={require("../../../../img/emoji-feliz.png")} alt="" />
                    </div>
                )
            } else {
                return (
                    <div >
                        <span>Calificación: </span>
                        <img className="emojiCalifi" src={require("../../../../img/emoji-triste.jpg")} alt="" />
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

    render() {
        return (
            <div className="fondoRespuestaActividades">
                <div className="actividadesMaestros">
                    <h2>{"Respuesta " + (this.props.index + 1)}</h2>
                    <div className="calificacion">{this.props.item.calificacion != null ? this.renderCalificacion(this.props.item.calificacion) : <span>Sin calificar</span>}</div>
                    <span>{this.props.item.descripcion}</span>
                    {this.state.verRecursos == false ?
                        <ArrowDropDownIcon className="expandir" onClick={() => this.verRecursos()} />
                        :
                        <ArrowDropUpIcon className="expandir" onClick={() => this.verRecursos()} />
                    }
                </div>

                {this.state.verRecursos == true ?
                    <ListaRecursos idRespuesta={this.props.item.id} fun={this} />
                    :
                    null
                }

            </div>
        )
    }
}
