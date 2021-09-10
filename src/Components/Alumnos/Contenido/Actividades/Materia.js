import React, { Component } from 'react'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import request from 'superagent';



export default class Materia extends Component {

    verMateria(menu, materia) {
        this.props.fun.cambiaContenido(menu)
        this.props.fun.cambiarMateria(materia)
    }

    getMaterias(idGrado) {
        this.props.fun.getMaterias(idGrado)
    }


    eliminarMateria() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/eliminarMateria')
            .send({ id: this.props.materia.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al eliminar información")

                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha eliminado la materia")
                    this.props.fun.getMaterias(this.props.idGrado)
                }
            });
    }

    eliminar() {
        if (this.props.materia.numActividades > 0) {
            nuevoMensaje(tiposAlertas.error, "Para eliminar una materia, esta no debe contener actividades")
        } else {
            this.eliminarMateria()
        }
    }


    render() {
        return (
            <div className="materiasMaestros" onClick={() => this.verMateria(2, this.props.materia)}>
                <img className="imagenbackTranspIzqBot" src={require("../../../../img/materias.png")} alt="" />
                <span className="nombreMateria"> {this.props.materia.nombre} </span>
                <span > {this.props.materia.numActividades + " Actividades"} </span>
                <KeyboardArrowRightIcon className="iconoMateria iconoOpen" />
            </div>
        )
    }
}
