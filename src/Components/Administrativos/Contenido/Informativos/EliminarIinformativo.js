import React, { Component } from 'react'
import "./AgregarInformativo.scss"
import { FormControl, InputLabel, Select, MenuItem, Input, TextField, Checkbox, FormControlLabel, Box, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import request from 'superagent';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'; import DateFnsUtils from '@date-io/date-fns';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import moment from "moment";
import AddIcon from '@material-ui/icons/Add';
import { resolve } from 'path';
import YouTube from 'react-youtube';


class EliminarInformativo extends Component {

    constructor(props) {
        super(props)

        this.state = {
            informativo: this.props.informativo,
            open: false,
        }
    }



    handleClickOpen = () => {
        this.props.fun.handleClickClose()
        this.setState({
            informativo: this.props.informativo,
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            informativo: "",
            open: false,
        })
    };


    eliminarInformativo() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/eliminarInformativo')
                .send({ id: this.state.informativo.id})
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

    
    eliminaImagen() {
        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/deleteInformativoImagen')
                .send({linkImage:  this.state.informativo.link})
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al guardar información")
                    } else {
                        resolve(res)
                    }
                });
        })
    }


    guardar() {

        return new Promise((resolve, reject) => {
            
            if (this.state.informativo.tipo == 1) {
                
                this.eliminarInformativo().then(()=> {
                    resolve()
                }).catch((error) => {
                    reject(error)
                })

            } else {

                this.eliminaImagen().then(()=> {
                    this.eliminarInformativo().then(()=> {
                        resolve()
                    }).catch((error) => {
                        reject(error)
                    })
                }).catch((error) => {
                    reject(error)
                })
                
            }

        })



    }

    

    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Creando Informativo")
        this.guardar().then(() => {
            this.props.fun2.getInformativos()
            nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
            this.handleClickClose()

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }


    render() {
        return (

            <React.Fragment>
                <MenuItem onClick={() => this.handleClickOpen()}>Eliminar informativo</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Eliminar informativo</div></DialogTitle>
                    <DialogContent>
                            <span>Estas seguro qeu deseas aliminar el informativo <strong>{this.props.informativo.titulo}</strong> ?</span>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.onSubmit()}>
                            Guardar
                    </Button>

                        <Button color="primary" onClick={this.handleClickClose}>
                            Cerrar
                    </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>


        )
    }
}

export default (withStyles({
    formControl: {
        width: '100%',
        margin: "0em 0em 1em 0em",
        minWidth: 120,
    },

    formControlInput: {
    },

})(EliminarInformativo))