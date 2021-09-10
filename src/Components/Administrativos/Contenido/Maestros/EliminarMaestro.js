import React, { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import AddIcon from '@material-ui/icons/Add';
import { MaysPrimera } from '../../../../Inicialized/GlobalFunctions';


export default class EliminarMaestro extends Component {


    constructor(props) {
        super(props)
        const maestro = this.props.maestro

        this.state = {
            maestro: maestro,
            open: false
        }
    }


    handleClickOpen = () => {
        const maestro = this.props.maestro
        this.props.fun2.handleClickClose()

        this.setState({
            maestro: maestro,
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            open: false,
        })
    };




    Eliminar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/eliminarMaestro')
                .send({ id: this.state.maestro.id })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {
                        resolve()

                    }
                });
        })
    }


    onSubmit = async () => {

        nuevoMensaje(tiposAlertas.cargando, "Eliminando maestro")

        this.Eliminar().then(() => {
            nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
            this.handleClickClose()
            this.props.fun.getListaMaestros()
        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })


    }



    render() {
        return (
            <React.Fragment>

                <MenuItem onClick={() => this.handleClickOpen()}>Eliminar maestro</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Eliminar Maestro</div></DialogTitle>
                    <DialogContent>
                        <div className="listasgrados">
                            <span>Estas seguro que deseas eliminar el maestro <strong>{this.state.maestro.nombre + " " + this.state.maestro.apellido + " ?"}</strong></span>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.onSubmit()}>
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
