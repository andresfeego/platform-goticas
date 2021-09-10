import React, { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import AddIcon from '@material-ui/icons/Add';
import { MaysPrimera } from '../../../../Inicialized/GlobalFunctions';


export default class EditarMaestro extends Component {


    constructor(props) {
        super(props)
        const maestro = this.props.maestro

        this.state = {
            id: maestro.id,
            correo: maestro.correo,
            nombre: maestro.nombre,
            apellido: maestro.apellido,
            open: false
        }
    }


    handleClickOpen = () => {
        const maestro = this.props.maestro
        this.props.fun2.handleClickClose()
        
        this.setState({
            id: maestro.id,
            correo: maestro.correo,
            nombre: maestro.nombre,
            apellido: maestro.apellido,
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            id: "",
            correo: "",
            nombre: "",
            apellido: "",
            open: false,
        })
    };



    validarInfo() {

        return new Promise((resolve, reject) => {

            if (this.state.nombre == "") {
                reject("Ingresa un nombre")
            } else {
                if (this.state.apellido == "") {
                    reject("Ingresa un apellido")
                } else {
                    if (this.state.correo == "") {
                        reject("Ingresa un correo electronico")
                    } else {
                        var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                        if (!expr.test(this.state.correo)) {
                            reject("El formato de correo es incorrecto Ej: usuario@empresa.com");
                        } else {
                            resolve()
                        }
                    }
                }
            }

        })

    }



    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/editarMaestro')
                .send({ id: this.state.id, nombre: this.state.nombre.toProperCase(), apellido: this.state.apellido.toProperCase(), correo: this.state.correo })
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
        nuevoMensaje(tiposAlertas.cargando, "Editando maestro")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()
                this.props.fun.getListaMaestros()
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

                <MenuItem onClick={() => this.handleClickOpen()}>Editar maestro</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Editar Maestro</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <Input className="inputform" type="text" placeholder="Identificación" disabled value={this.state.id} name="id" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Nombre" value={this.state.nombre} name="nombre" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Apellidos" value={this.state.apellido} name="apellido" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Correo" value={this.state.correo} name="correo" onChange={this.onChange} />

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
