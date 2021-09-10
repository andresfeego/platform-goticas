

import React, { Component } from 'react'
import { FormControl, InputLabel, Select, MenuItem, Input, TextField, Checkbox, FormControlLabel, Box, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import request from 'superagent';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'; import DateFnsUtils from '@date-io/date-fns';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import moment from "moment";
import AddIcon from '@material-ui/icons/Add';
import { resolve } from 'path';

class AgregarGaleria extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }
    }
    
    handleClickOpen = () => {
        this.props.fun.handleClickClose()
        this.setState({
            open: true,
        })
    };
    
    
    handleClickClose = () => {
        this.setState({
            open: false,
        })
    };


    guardar() {
        
        return new Promise((resolve, reject) => {
        
            request
            .post('/responseLIGDS/eliminarGaleria')
            .send({ id: this.props.galeria.id})
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    reject( "Error al guardar información")

                } else {
                    resolve()
                }
            });

    })
}

    
    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Eliminando Galería")
            this.guardar().then(() => {
                this.props.fun2.getGalerias()
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

    }




    render() {
        return (

            <React.Fragment>
                <MenuItem onClick={() => this.handleClickOpen()}>Eliminar</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Eliminar galería</div></DialogTitle>
                    <DialogContent>
                     <span>¿ Estas seguro que deseas eliminar la galeria <strong>{this.props.galeria.nombre}</strong> y todas sus imagenes ?</span>

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

})(AgregarGaleria))