import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, TextField } from '@material-ui/core';
import React, { Component } from 'react'
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import DoneIcon from '@material-ui/icons/Done';
import BackupIcon from '@material-ui/icons/Backup';
import './AgregarImagenes.scss'
import request from 'superagent';




var actualizar;

export default class EliminarImagenesAll extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false
        }
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            open: false,
        })
    };

    
    eliminarImagen(id, idGaleria, link){
        request
        .post('/responseLIGDS/deleteImagenGaleria')
        .send({ id: id, idGaleria: idGaleria, link: link })
        .set('accept', 'json')
        .end((err, res) => {
            if (err) {
                console.log(err);
            } else {
                this.handleClickClose()
                this.props.fun.getImagenes()
            }
        });
    }


    eliminarImagenes(){
        this.props.lista.map((imagen) => {
            this.eliminarImagen(imagen.id, this.props.galeria.id, imagen.link)
        })
    }


    render() {
        return (
            <React.Fragment>

                <div className="boton" onClick={() => this.handleClickOpen()}>
                    Eliminar todas las imagenes
                </div>


                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Eliminar todas las imagenes para {this.props.galeria.nombre}</div></DialogTitle>
                    <DialogContent>
                        <span>¿ Estas seguro que deseas eliminar todas las imagenes para esta galería ?</span>

                    </DialogContent>

                    <DialogActions>
                        <Button color="primary" onClick={() => this.eliminarImagenes()}>
                            Si
                </Button>

                        <Button color="primary" onClick={this.handleClickClose}>
                            No
                </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

        )
    }
}
