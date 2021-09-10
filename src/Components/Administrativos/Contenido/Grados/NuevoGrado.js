import React, { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import AddIcon from '@material-ui/icons/Add';


export default class NuevoGrado extends Component {


    constructor(props) {
        super(props)

        this.state = {
            nombre: "",
        }
    }


    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            nombre: "",
            open: false,
        })
    };

    validarInfo() {

        return new Promise((resolve, reject) => {

            if (this.state.nombre == "") {
                reject("No has ingresado un nombre")

            } else {
                resolve()
            }

        })

    }


    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/crearGrado')
                .send({ nombre: this.state.nombre })
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
        nuevoMensaje(tiposAlertas.cargando, "Creando Grado")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()
                this.props.fun.getGrados()
            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }



    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }


    render() {
        return (
            <React.Fragment>
                <Box className="gradoAdmin nuevoGrado" onClick={() => this.handleClickOpen()}>
                    <AddIcon /> 
                    <span>Nuevo grado</span>
                </Box>


                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Nuevo Grado</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <Input className="inputform" type="text" placeholder="Nombre" value={this.state.nombre} name="nombre" onChange={this.onChange} />

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
