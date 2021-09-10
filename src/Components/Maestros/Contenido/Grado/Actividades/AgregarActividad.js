import React, { Component } from 'react'
import "./AgregarActividad.scss"
import { Box, Dialog, DialogTitle, DialogContent, Input, DialogActions, Button } from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast';
import request from 'superagent';


export default class AgregarActividad extends Component {


    constructor(props) {
        super(props)

        this.state = {
            open: false,
            nombre: '',
            descripcion: '',
            fechaLimite: new Date()

        };
    };

    handleClickOpen = () => {
        this.setState({
            open: !this.state.open

        })
    };

    handleDateChange = (date) => {
        this.setState({
            fechaLimite: date
        })
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    validarInfo() {
        if (this.state.nombre == '') {
            nuevoMensaje(tiposAlertas.error, "Debes agregar un nombre para la actividad")
        } else {
            if (this.state.descripcion == '') {
                nuevoMensaje(tiposAlertas.error, "Debes agregar una descripción para la actividad")
            } else {
                return true
            }
        }
    }

    agregarActividad() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/agregarActividad')
            .send({ nombre: this.state.nombre, descripcion: this.state.descripcion, fechaLimite: this.state.fechaLimite, idMateria: this.props.materia.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha agregado la actividad")
                    this.props.fun.getActividdades(this.props.materia.id)
                    this.handleClickOpen();
                }
            });
    }

    onSubmit = () => {
        if (this.validarInfo()) {
            this.agregarActividad()
        }
    }

    render() {
        return (
            <React.Fragment>

                <Box boxShadow={6} className="button buttonUno buttonDelgado" onClick={() => this.handleClickOpen()}>Agregar actividad</Box>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><h2 className="tituloAgregarActividad">{"Nueva actividad para " + this.props.nombreGrado}</h2></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>
                                <Input className="inputform" type="text" placeholder="Nombre de la actividad" value={this.state.nombre} name="nombre" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Descripción" value={this.state.descripcion} name="descripcion" onChange={this.onChange} />
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Fecha limite de entrega"
                                        value={this.state.fechaLimite}
                                        onChange={this.handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
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
