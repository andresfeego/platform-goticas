import React, { Component } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, Input, DialogActions, Button } from '@material-ui/core';
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast';
import request from 'superagent';

export default class AgregarMateria extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            nombre: '',

        };
    };


    handleClickOpen = () => {
        this.setState({
            open: !this.state.open

        })
    };


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }


    validarInfo() {
        if (this.state.nombre == '') {
            nuevoMensaje(tiposAlertas.error, "Debes agregar un nombre para la materia")
        } else {
            return true
        }
    }

    agregarMateria() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/agregarMateria')
            .send({ nombre: this.state.nombre, idGrado: this.props.idGrado })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha agregado la materia")
                    this.props.fun.getMaterias(this.props.idGrado)
                    this.handleClickOpen();
                }
            });
    }

    onSubmit = () => {
        if (this.validarInfo()) {
            this.agregarMateria()
        }
    }


    render() {
        return (
            <React.Fragment>

                <Box boxShadow={6} className="button buttonUno buttonDelgado" onClick={() => this.handleClickOpen()}>Agregar materia</Box>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><h2 className="tituloAgregarActividad">{"Nueva materia para " + this.props.nombreGrado}</h2></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>
                                <Input className="inputform" type="text" placeholder="Nombre de la materia" value={this.state.nombre} name="nombre" onChange={this.onChange} />

                                <div className="button buttonUno buttonDelgado" onClick={this.onSubmit}>Guardar</div>
                            </form>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleClickOpen}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}
