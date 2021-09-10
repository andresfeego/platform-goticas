import React, { Component } from 'react'
import "./AgregarActividad.scss"
import { Box, Dialog, DialogTitle, DialogContent, Input, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast';
import request from 'superagent';
import { withStyles } from '@material-ui/core/styles'



class EditarActividad extends Component {


    constructor(props) {
        super(props)

        this.state = {
            open: false,
            nombre: this.props.actividad.nombre,
            materia: this.props.materia.id,
            descripcion: this.props.actividad.descripcion,
            fechaLimite: this.props.actividad.fechaLimite,
            listaMaterias: []

        };
    };



    componentDidMount() {
        this.getMaterias(this.props.idGrado)
    }

    componentWillReceiveProps(nextProps) {
        this.getMaterias(nextProps.idGrado)
    }



    getMaterias(idGrado) {
        request
            .get('/responseLIGDS/materiasXgrado/' + idGrado)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            listaMaterias: [],
                        })
                    } else {
                        this.setState({
                            listaMaterias: respuestaLogin,
                        })
                    }
                }
            });
    }

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
                if (this.state.materia == 0) {
                    nuevoMensaje(tiposAlertas.error, "Debes escoger una materia para la actividad")
                } else {
                    return true
                }
            }
        }
    }

    editarActividad() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/editarActividad')
            .send({ nombre: this.state.nombre, descripcion: this.state.descripcion, idMateria: this.state.materia, fechaLimite: this.state.fechaLimite, idActividad: this.props.actividad.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha editado la actividad")
                    this.props.fun.actualizarLista()
                    this.setState({
                        nombre: '',
                        materia: 0,
                        descripcion: '',
                        fechaLimite: '',
                    })
                    this.handleClickOpen();
                }
            });
    }

    onSubmit = () => {
        if (this.validarInfo()) {
            this.editarActividad()
        }
    }

    render() {
        return (
            <React.Fragment>

                <Box boxShadow={6} className="button buttonUno buttonDelgado buttonEditarActividad" onClick={() => this.handleClickOpen()}>Editar</Box>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><h2 className="tituloAgregarActividad">{"Editando actividad " + this.props.actividad.nombre}</h2></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>
                                <Input className="inputform" type="text" placeholder="Nombre de la actividad" value={this.state.nombre} name="nombre" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Descripción" value={this.state.descripcion} name="descripcion" onChange={this.onChange} />

                                <FormControl className={this.props.classes.formControl}>
                                    <InputLabel className={this.props.classes.formControlInput} htmlFor="max-width">Materia</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.materia} inputProps={{ name: 'materia', id: 'materia' }} >
                                        <MenuItem value={0}>Seleccione una materia</MenuItem>
                                        {this.state.listaMaterias.map((materia) => <MenuItem value={materia.id}>{materia.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>


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

export default (withStyles({


    formControl: {
        width: '100%',
        margin: "0em 0em 2em 0em",
        minWidth: 120,
    },

    formControlInput: {
    },



})(EditarActividad));
