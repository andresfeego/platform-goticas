import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { Component } from 'react'
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import "./AgregarAlumno.scss"

export default class AgregarAlumno extends Component {

    constructor(props) {
        super(props)

        this.state = {
            identificacion: "",
            nombres: "",
            apellidos: "",
            email: "",
            telefono: "",
            open: false,
            listadoGrados: [],
            idGrado: this.props.grado.id

        }
    }

    componentDidMount() {
        this.getGrados()
    }

    getGrados() {
        request
            .get('/responseLIGDS/grados')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listadoGrados: respuestaLogin,
                    })
                }
            });
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            identificacion: "",
            nombres: "",
            apellidos: "",
            email: "",
            telefono: "",
            open: false,
            idGrado: this.props.grado.id
        })
    };


    validarUsuarioExistente() {
        return new Promise((resolve, reject) => {
            request
                .get('/responseLIGDS/alumnoExiste/' + this.state.identificacion)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al consultar si usuario existe en la base de datos")
                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        if (respuestaLogin.length == 0) {
                            resolve()
                        } else {
                            reject("El documento ya esta en uso para el usuario " + respuestaLogin[0].nombre + " " + respuestaLogin[0].apellidos)
                        }
                    }
                });
        })
    }

    validarInfo() {

        return new Promise((resolve, reject) => {

            if (this.state.identificacion == "") {
                reject("No has ingresado número de documento")

            } else {
                var expr = /^([0-9])*$/;
                if (!expr.test(this.state.identificacion)) {
                    reject("El formato de número de documento es invalido, solo se aceptan números")
                } else {

                    this.validarUsuarioExistente().then(() => {

                        if (this.state.nombres == "") {
                            reject("Ingresa un nombre")
                        } else {
                            if (this.state.apellidos == "") {
                                reject("Ingresa un apellido")
                            } else {
                                if (this.state.email == "") {
                                    reject("Ingresa un correo electronico")
                                } else {
                                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                                    if (!expr.test(this.state.email)) {
                                        reject("El formato de correo es incorrecto Ej: usuario@empresa.com");
                                    } else {
                                        if (this.state.telefono == "") {
                                            reject("Debes agregar un número telefonico para el alumno");
                                        } else {
                                            var expr = /^([0-9])*$/;

                                            if (!expr.test(this.state.telefono)) {
                                                reject("El formato de número de telefono es invalido, solo se aceptan números")
                                            } else {
                                                if (this.state.idGrado == 0 || this.state.idGrado == null) {
                                                    reject("Debes escoger un grado")
                                                } else {
                                                    resolve()
                                                }
                                            }
                                        }
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

    return new Promise( (resolve, reject) => {
        request
            .post('/responseLIGDS/crearAlumno')
            .send({ id: this.state.identificacion, grado: this.state.idGrado, nombres: this.state.nombres, apellidos: this.state.apellidos, email: this.state.email, telefono: this.state.telefono })
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
        nuevoMensaje(tiposAlertas.cargando, "Creando Alumno")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()
                this.props.fun.getAlumnos()

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
                <Box className="btnNuevoEstudiante buElement" onClick={() => this.handleClickOpen()}>
                    <PersonAddSharpIcon className="icon" />
                    Nuevo Alumno
            </Box>


                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Nuevo Alumno</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>


                                <Input className="inputform" type="text" placeholder="Número de registro civil" value={this.state.identificacion} name="identificacion" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Nombres" value={this.state.nombres} name="nombres" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Apellidos" value={this.state.apellidos} name="apellidos" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="E-mail" value={this.state.email} name="email" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Telefono de contacto" value={this.state.telefono} name="telefono" onChange={this.onChange} />

                                <FormControl className="inputform" >
                                    <InputLabel htmlFor="max-width">Grado</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.idGrado} inputProps={{ name: 'idGrado', id: 'idGrado' }} >
                                        <MenuItem key={0} value={0}>Seleccione el grado</MenuItem>
                                        {this.state.listadoGrados.map((grado) => <MenuItem key={grado.id} value={grado.id}>{grado.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>

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
