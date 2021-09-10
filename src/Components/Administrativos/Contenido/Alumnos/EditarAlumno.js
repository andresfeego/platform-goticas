import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { Component } from 'react'
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import "./AgregarAlumno.scss"
import Cargando from '../../../../Inicialized/Cargando';

export default class EditarAlumno extends Component {

    constructor(props) {
        super(props)
        const alumno = this.props.alumno
        var idGrado = alumno.idGrado
        if (idGrado == null) {
            idGrado = 0
        }
        this.state = {
            id: alumno.id,
            identificacion: alumno.usuario,
            identificacionOriginal: alumno.usuario,
            nombres: alumno.nombre,
            apellidos: alumno.apellidos,
            email: alumno.correo,
            telefono: alumno.telefonoContacto,
            open: false,
            listadoGrados: [],
            idGrado: idGrado,
            idGradoOriginal: idGrado

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
        const alumno = this.props.alumno
        this.props.fun.handleClickClose()
       

        this.setState({
            id: alumno.id,
            identificacion: alumno.usuario,
            nombres: alumno.nombre,
            apellidos: alumno.apellidos,
            email: alumno.correo,
            telefono: alumno.telefonoContacto,
            open: true,
            idGrado: alumno.idGrado? alumno.idGrado: 0,
            idGradoOriginal: alumno.idGrado? alumno.idGrado: 0

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
            idGrado: 0
        })
    };


    validarUsuarioExistente() {
        return new Promise((resolve, reject) => {
            if (this.state.identificacionOriginal == this.state.identificacion) {
                resolve()
            } else {
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
            }
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
                                if (this.state.idGrado == 0 || this.state.idGrado == null) {
                                    reject("Debes asignar un grado")
                                } else {
                                    if (this.state.email != "" && this.state.email != null ) {
                                        var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                                        if (!expr.test(this.state.email)) {
                                            reject("El formato de correo es incorrecto Ej: usuario@empresa.com");
                                        } 
                                    } 
    
                                    if (this.state.telefono != "" && this.state.telefono != null) {
                                        var expr = /^([0-9])*$/;
    
                                        if (!expr.test(this.state.telefono)) {
                                            reject("El formato de número de telefono es invalido, solo se aceptan números")
                                        }
                                    } 
    
                                    resolve()

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
            .post('/responseLIGDS/editarAlumno')
            .send({ id: this.state.id, identificacion: this.state.identificacion, nombres: this.state.nombres, apellidos: this.state.apellidos, email: this.state.email, telefono: this.state.telefono, grado: this.state.idGrado, gradoOriginal: this.state.idGradoOriginal })
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
        nuevoMensaje(tiposAlertas.cargando, "Editando Alumno")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()
                this.props.funDos.getAlumnos()

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

            <MenuItem onClick={() => this.handleClickOpen()}>Editar</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Editar Alumno</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>


                                <Input className="inputform" type="text" placeholder="Número de registro civil" value={this.state.identificacion} name="identificacion" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Nombres" value={this.state.nombres} name="nombres" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Apellidos" value={this.state.apellidos} name="apellidos" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="E-mail" value={this.state.email} name="email" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Telefono de contacto" value={this.state.telefono} name="telefono" onChange={this.onChange} />

                                {this.state.listadoGrados.length == 0 ?
                                    <Cargando/>
                                    :
                                    <FormControl className="inputform" >
                                        <InputLabel htmlFor="max-width">Grado</InputLabel>
                                        <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.idGrado} inputProps={{ name: 'idGrado', id: 'idGrado' }} >
                                            <MenuItem key={0} value={0}>Seleccione el grado</MenuItem>
                                            {this.state.listadoGrados.map((grado) => <MenuItem key={grado.id} value={grado.id}>{grado.nombre}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                }

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
