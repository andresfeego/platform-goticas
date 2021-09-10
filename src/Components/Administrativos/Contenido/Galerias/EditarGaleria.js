

import React, { Component } from 'react'
import "../Informativos/AgregarInformativo.scss"
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
        const galeria = this.props.galeria
        
        this.state = {
            nombre: galeria.nombre,
            descripcion: galeria.descripcion,
            opne: false
        }
    }
    

    
    handleClickOpen = () => {
        this.props.fun.handleClickClose()
        const galeria = this.props.galeria
        this.setState({
            nombre: galeria.nombre,
            descripcion: galeria.descripcion,
            open: true,
        })
    };
    
    
    handleClickClose = () => {
        this.setState({
            nombre: "",
            descripcion: "",
            open: false,
        })
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

   
    validarInfo() {

        return new Promise((resolve, reject) => {
            if (this.state.nombre == '') {
                reject("Debes agregar un nombre para esta galeria")
            } else {
                if (this.state.descripcion == '') {
                    reject("Debes agragar una descipción para esta galeria")
                } else {
                    resolve()
                }
            }
        })


    }

    
    guardar() {
        
        return new Promise((resolve, reject) => {
        
            request
            .post('/responseLIGDS/editarGaleria')
            .send({ id: this.props.galeria.id, nombre: this.state.nombre, descripcion: this.state.descripcion })
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
        nuevoMensaje(tiposAlertas.cargando, "Editando Galería")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                this.props.fun2.getGalerias()
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }




    render() {
        return (

            <React.Fragment>
                <MenuItem onClick={() => this.handleClickOpen()}>Editar</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Editar galería</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <TextField className="inputform" label="Título" type="text" value={this.state.nombre} name="nombre" onChange={this.onChange} />
                                <TextField className="inputform" label="Descripción" multiline rowsMax={8} value={this.state.descripcion} name="descripcion" onChange={this.onChange} />

                            </form>
                        </div>

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