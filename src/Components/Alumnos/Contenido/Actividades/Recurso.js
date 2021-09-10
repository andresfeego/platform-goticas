import React, { Component } from 'react'
import "./Recurso.scss"
import DeleteIcon from '@material-ui/icons/Delete';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import request from 'superagent';


export default class Recurso extends Component {


    eliminarRecurso(id, tipo, link) {
        nuevoMensaje(tiposAlertas.cargando, "Eliminando recurso")
        request
            .post('/responseLIGDS/eliminarEvidencia')
            .send({ id: id, tipo: tipo, link: link })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al eliminar recurso")

                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha eliminado el recurso")
                    this.props.fun.getRecursos()
                }
            });
    }

    renderRecurso(item) {
        switch (item.tipo) {
            case 1:
                return (
                    <div className="contRecursoRespuesta">
                        <a href={"../../../../../recursosActividad/videos/" + item.link} target="_blanck" className="RecursoMaestros">
                            <img src={require("../../../../img/icon-video.png")} alt="" />
                        </a>
                        <DeleteIcon className="iconDeleteRecurso" onClick={() => this.eliminarRecurso(item.id, item.tipo, item.link)} />
                    </div>

                )
                break;

            case 2:
                return (
                    <div className="contRecursoRespuesta">
                        <a href={"../../../../../recursosActividad/guias/" + item.link} target="_blanck" className="RecursoMaestros">
                            <img src={require("../../../../img/icon-pdf.png")} alt="" />
                        </a>
                        <DeleteIcon className="iconDeleteRecurso" onClick={() => this.eliminarRecurso(item.id, item.tipo, item.link)} />
                    </div>
                )
                break;

            case 3:
                return (
                    <div className="contRecursoRespuesta">
                        <a href={"../../../../../recursosActividad/imagenes/" + item.link} target="_blanck" className="RecursoMaestros">
                            <img src={require("../../../../img/icon-imagen2.png")} alt="" />
                        </a>
                        <DeleteIcon className="iconDeleteRecurso" onClick={() => this.eliminarRecurso(item.id, item.tipo, item.link)} />
                    </div>
                )
                break;

            default:
                break;
        }
    }


    render() {
        const item = this.props.item
        return (
            this.renderRecurso(item)
        )
    }
}
