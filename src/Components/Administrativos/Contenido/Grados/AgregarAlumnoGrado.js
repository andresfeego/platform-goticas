import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { Component } from 'react'
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import Cargando from '../../../../Inicialized/Cargando';
import "./AgregarAlumnoGrado.scss"

var buscar


export default class AgregarAlumnoGrado extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            listadoAlumnos: "init",
            busqueda: "",
            listadoAlumnosOriginal: [],
            idGrado: this.props.grado.id

        }
    }

    componentDidMount() {
        this.getAlumnos()
    }

    getAlumnos() {

        this.setState({
            listadoAlumnos: "init"
        })

        request
            .get('/responseLIGDS/alumnosSinGrado')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listadoAlumnos: respuestaLogin,
                        listadoAlumnosOriginal: respuestaLogin,
                    })
                }
            });
    }


    onChange = e => {
        clearTimeout(buscar)
        var value = e.target.value
        this.setState({
            [e.target.name]: value
        })

        buscar = setTimeout(() => this.buscar(value), 500);

    }

    buscar(busqueda) {
        this.setState({
            listadoAlumnos: "init",
        })

        if (busqueda == "") {

            this.setState({
                listadoAlumnos: this.state.listadoAlumnosOriginal,
            })

        } else {

            var prepBus = new RegExp(busqueda, 'i'); // preparando termino de busqueda
            let estudiantesAuxi = this.state.listadoAlumnosOriginal.filter((item) => {
                if (prepBus.test(item.nombre) || prepBus.test(item.apellidos) || prepBus.test(item.usuario)) {
                    return true
                } else {
                    return false
                }
            });
            if (estudiantesAuxi.length == 0) {
                estudiantesAuxi = "vacio"
            }
            this.setState({
                listadoAlumnos: estudiantesAuxi,
            })

        }
    }



    handleClickOpen = () => {
        this.props.fun.handleClickClose()
        this.setState({
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            open: false,
            listadoAlumnos: this.state.listadoAlumnosOriginal,
            idGrado: this.props.grado.id
        })
    };


    validarInfo() {

        return new Promise((resolve, reject) => {

            if (this.state.identificacion == "") {
                reject("No has ingresado número de documento")

            } else {
                resolve()
            }

        })

    }


    guardar(idAlumno, idGrado) {

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/agregarAlumnoAgrado')
                .send({ idAlumno: idAlumno, idGrado: idGrado })
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


    onSubmit = async (idAlumno, idGrado) => {
        nuevoMensaje(tiposAlertas.cargando, "Agregando Alumno")
            this.guardar(idAlumno, idGrado).then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.getAlumnos()

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

       
    }


    renderAlumno(alumno) {

        return (
            <div className="alumnoAgregar">
                <span>{alumno.nombre + " " + alumno.apellidos} </span>
                <span className="usuario">{alumno.usuario}</span>
                <span className="agregarAl" onClick={()=> this.onSubmit(alumno.id, this.props.grado.id)}>Agregar</span>

            </div>
        )

    }

    renderListaAlumnos() {
        if (this.state.listadoAlumnos == "init") {
            return <Cargando />
        } else {
            if (this.state.listadoAlumnos == "vacio") {
                return <span>No hay coincidencias</span>
            } else {
                return (
                    <div className="listaAlumnosAdmin listaAlumnosAdminGrados">
                        {this.state.listadoAlumnos.map((alumno) =>
                            this.renderAlumno(alumno)
                        )}
                    </div>
                )
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <MenuItem onClick={() => this.handleClickOpen()}>Agregar alumno</MenuItem>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad"> {"Agregar alumno a grado " + this.props.grado.nombre}</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>
                                <Input className="inputform" type="text" placeholder="Buscar por registro civil o nombres" value={this.state.busqueda} name="busqueda" onChange={this.onChange} />
                            </form>
                        </div>

                        <div className="listaAlumnos">
                            {this.state.listadoAlumnos != "init" ?
                                this.renderListaAlumnos()
                                :
                                <Cargando />
                            }
                        </div>

                    </DialogContent>
                    <DialogActions>

                        <Button color="primary" onClick={this.handleClickClose}>
                            Cerrar
                    </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}
