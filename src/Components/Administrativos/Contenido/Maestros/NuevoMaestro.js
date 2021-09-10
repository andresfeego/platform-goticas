import React, { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import AddIcon from '@material-ui/icons/Add';
import { MaysPrimera } from '../../../../Inicialized/GlobalFunctions';


export default class NuevoMaestro extends Component {


    constructor(props) {
        super(props)

        this.state = {
            id: "",
            correo: "",
            nombre: "",
            apellido: "",
            open: false
        }
    }


    handleClickOpen = () => {
        this.setState({
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


    validarMaestroExistente() {
        return new Promise((resolve, reject) => {
            request
                .get('/responseLIGDS/maestroExiste/' + this.state.id)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al consultar si maestro existe en la base de datos")
                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        if (respuestaLogin.length == 0) {
                            resolve()
                        } else {
                            reject("El documento ya esta en uso para el maestro " + respuestaLogin[0].nombre + " " + respuestaLogin[0].apellido)
                        }
                    }
                });
        })
    }

    validarInfo() {

        return new Promise((resolve, reject) => {

            if (this.state.id == "") {
                reject("No has ingresado número de documento")

            } else {
                var expr = /^([0-9])*$/;
                if (!expr.test(this.state.id)) {
                    reject("El formato de número de documento es invalido, solo se aceptan números")
                } else {

                    this.validarMaestroExistente().then(() => {

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

                    }).catch((error) => {
                        reject(error)
                    })


                }
            }

        })

    }



    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/crearMaestro')
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
        nuevoMensaje(tiposAlertas.cargando, "Creando maestro")
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
                <Box className="gradoAdmin nuevoGrado" onClick={() => this.handleClickOpen()}>
                    <AddIcon /> 
                    <span>Nuevo maestro</span>
                </Box>


                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Nuevo Maestro</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                            <Input className="inputform" type="text" placeholder="Identificación" value={this.state.id} name="id" onChange={this.onChange} />
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
