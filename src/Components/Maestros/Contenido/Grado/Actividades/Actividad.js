import React, { Component } from 'react'
import "./Actividad.scss"
import ListaRecursos from './ListaRecursos'
import moment from 'moment'
import EditarActividad from './EditarActividad'
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast'
import request from 'superagent'



export default class Actividad extends Component {


    constructor(props) {
        super(props)

        this.state = {
            numrecursos: 0,
            verRecursos: false
        }
    }




    setNumRecursos(num) {
        this.setState({
            numrecursos: num
        })
    }



    verRecursos() {
        this.setState({
            verRecursos: !this.state.verRecursos
        })
    }

    actualizarLista() {
        this.props.fun.getActividdades(this.props.materia.id)
    }

    eliminarActividad(id) {
        console.log(this.props)
        if (this.props.item.numRecursos == 0) {
            nuevoMensaje(tiposAlertas.cargando, "Guardando información")
            request
                .post('/responseLIGDS/eliminarActividad')
                .send({ id: this.props.item.id })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                    } else {
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha eliminado la actividad")
                        this.actualizarLista()
                    }
                });
        } else {
            nuevoMensaje(tiposAlertas.error, "Para eliminar una actividad primero debes eliminar sus recursos")
        }

    }

    verActividad(id) {
        this.props.fun.cambiarActividad(id)
        this.props.fun.cambiaContenido(2)
    }

    render() {
        const item = this.props.item

        return (
            <div className="fondoActividadesMaestros">
                <div className="actividadesMaestros">
                    <img className="imagenbackTranspDerBot" src={require("../../../../../img/actividades.png")} alt="" />

                    <div className="button buttonUno buttonDelgado buttonVerActividad" onClick={() => this.verActividad(item.id)}>Ver</div>
                    <EditarActividad actividad={item} fun={this} materia={this.props.materia} idGrado={this.props.idGrado} />
                    <DeleteIcon className="iconDeleteActividad" onClick={() => this.eliminarActividad(item.id)} />

                    <h2 className="nombre">{item.nombre}</h2>
                    <span>{"Fecha limite: " + moment(item.fechaLimite).format("YYYY-MM-DD")}</span>
                    <p className="descripcion">{item.descripcion}</p>
                    <span className="numRecursos">{item.numRecursos + " rec."}</span>
                    {this.state.verRecursos == false ?
                        <ArrowDropDownIcon className="expandir" onClick={() => this.verRecursos()} />
                        :
                        <ArrowDropUpIcon className="expandir" onClick={() => this.verRecursos()} />
                    }
                </div>

                {this.state.verRecursos == true ?
                    <ListaRecursos idActividad={item.id} fun={this} />
                    :
                    null
                }

            </div>

        )
    }
}
