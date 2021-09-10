import React, { Component } from 'react'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';


export default class ImagenGaleria extends Component {



    eliminarImagen(id, idGaleria, link){
        nuevoMensaje(tiposAlertas.cargando, "Eliminando imagen")
        request
        .post('/responseLIGDS/deleteImagenGaleria')
        .send({ id: id, idGaleria: idGaleria, link: link })
        .set('accept', 'json')
        .end((err, res) => {
            if (err) {
                console.log(err);
                nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

            } else {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Eliminada")
                this.props.fun.getImagenes()
            }
        });
    }


    render() {

        const {imagen, galeria, finLista, index } = this.props

        return (
            <div className="imagen">
                <img src={"./recursosGalerias/images/"+galeria.id+"/"+ imagen.link} alt="" />
                <div className="botones">
                    {index > 0 ? <ArrowDropUpIcon className="flecha" onClick={() => this.props.fun.moverArriba(index)}/>: null}
                    <HighlightOffIcon className="eliminar" onClick={() => this.eliminarImagen(imagen.id, galeria.id, imagen.link)}/>
                    {index < finLista-1 ? <ArrowDropDownIcon  className="flecha" onClick={() => this.props.fun.moverAbajo(index)}/>: null}

                </div>
            </div>
        )
    }
}
