import React, { Component } from 'react'
import "./VerGaleria.scss"

import AgregarImagenes from './AgregarImagenes'
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';
import ImagenGaleria from './ImagenGaleria';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import EliminarImagenesAll from './EliminarImagenesAll';

export default class VerGaleria extends Component {

    constructor(props) {
        super(props)

        this.state = {
            imagenes: "init"
        }
    }



    componentDidMount() {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getImagenes()
    }

    getImagenes() {
        request
            .get('/responseLIGDS/imagenesGalerias/' + this.props.galeria.id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        imagenes: respuestaLogin,
                    })
                }
            });
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarEstado(9)
        }
    }


    moverOrdenImagenGaleria(from, to) {

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/moverOrdenImagenGaleria')
                .send({ from: from, to: to })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al guardar información")

                    } else {
                        resolve()
                    }
                });


        })

    }


    moverArriba(index) {
        nuevoMensaje(tiposAlertas.cargando, "Moviendo...")
        const lista = this.state.imagenes
        this.moverOrdenImagenGaleria(lista[index].orden, lista[index - 1].orden).then(() => {
            nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
            this.getImagenes()
        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })

    }

    moverAbajo(index) {
        nuevoMensaje(tiposAlertas.cargando, "Moviendo...")
        const lista = this.state.imagenes
        this.moverOrdenImagenGaleria(lista[index].orden, lista[index + 1].orden).then(() => {
            nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
            this.getImagenes()
        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }


    eliminarImagen(id, idGaleria, link) {
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

    renderListaImagenes() {
        if (this.state.imagenes.length == 0) {
            return <span>Sin imagenes para esta galería</span>
        } else {
            return (
                this.state.imagenes.map((imagen, index) => <ImagenGaleria galeria={this.props.galeria} finLista={this.state.imagenes.length} fun={this} index={index} imagen={imagen} />

                )
            )

        }
    }



    render() {
        const galeria = this.props.galeria

        return (
            <div className="containerGaleria">
                <span className="nombre">
                    {galeria.nombre}
                </span>

                <div className="descripcion">
                    {galeria.descripcion}
                </div>

                <div className="botones">

                    <AgregarImagenes galeria={galeria} fun={this} />
                    <EliminarImagenesAll galeria={galeria} fun={this} lista={this.state.imagenes}/>

                </div>

                <div className="listaImagenes">

                    {this.state.imagenes == "init" ?
                        <Cargando />
                        :
                        this.renderListaImagenes()

                    }



                </div>
            </div>
        )
    }
}
