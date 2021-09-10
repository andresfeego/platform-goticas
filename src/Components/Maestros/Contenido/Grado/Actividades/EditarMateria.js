import React, { Component } from 'react'
import "./AgregarMateria.scss"
import { Box, Dialog, DialogTitle, DialogContent, Input, DialogActions, Button } from '@material-ui/core';
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast';
import request from 'superagent';
import EditIcon from '@material-ui/icons/Edit';



export default class EditarMateria extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            nombre: this.props.materia.nombre,

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

    editarMateria() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/editarMateria')
            .send({ id: this.props.materia.id, nombre: this.state.nombre })
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
            this.editarMateria()
        }
    }


    render() {
        return (
            <React.Fragment>

                <Box onClick={() => this.handleClickOpen()}>
                    <EditIcon className="iconoMateria iconoEdit" />
                </Box>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><h2 className="tituloAgregarActividad">{"Editando materia " + this.props.materia.nombre}</h2></DialogTitle>
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
