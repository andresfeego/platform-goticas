import React, { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import AddIcon from '@material-ui/icons/Add';
import { MaysPrimera } from '../../../../Inicialized/GlobalFunctions';
import Cargando from '../../../../Inicialized/Cargando';
import "./EditarGradosMaestro.scss"


export default class EditarGradosMaestro extends Component {


    constructor(props) {
        super(props)
        const maestro = this.props.maestro

        this.state = {
            maestro: maestro.id,
            gradosMaestro: "init",
            gradosDisponibles: "init",
            open: false
        }
    }

    componentDidMount() {
        this.getGradosMaestro()
        this.getGradosDisponibles()
    }

    getGradosMaestro() {
        this.setState({
            gradosMaestro: "init"
        })

        request
            .get('/responseLIGDS/gradosXprofesor/' + this.props.maestro.id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        gradosMaestro: respuestaLogin,
                    })
                }
            });
    }

    getGradosDisponibles() {
        this.setState({
            gradosDisponibles: "init"
        })

        request
            .get('/responseLIGDS/gradosSinProfesor')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        gradosDisponibles: respuestaLogin,
                    })
                }
            });
    }


    handleClickOpen = () => {
        const maestro = this.props.maestro
        this.props.fun2.handleClickClose()

        this.setState({
            maestro: maestro.id,
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            maestro: "",
            open: false,
        })
    };



    quitarGradoAmaestro(idGrado, idMaestro) {
        
        nuevoMensaje(tiposAlertas.cargando, "Quitando grado a este maestro")

        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/quitarGradoAmaestro')
                .send({ idGrado: idGrado, idMaestro: idMaestro})
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        nuevoMensaje(tiposAlertas.cargadoError, "Error al quitar el grado")
                        reject("Error al guardar información")

                    } else {
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                        this.getGradosMaestro()
                        this.getGradosDisponibles()
                        resolve()

                    }
                });
        })
    }


    agregarGradoAmaestro(idGrado, idMaestro) {

        nuevoMensaje(tiposAlertas.cargando, "Agregando grado a este maestro")
        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/agregarGradoAmaestro')
                .send({ idGrado: idGrado, idMaestro: idMaestro})
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        nuevoMensaje(tiposAlertas.cargadoError, "Error al agregar el grado")
                        reject("Error al guardar información")

                    } else {
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                        this.getGradosMaestro()
                        this.getGradosDisponibles()
                        resolve()

                    }
                });
        })
    }



    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }



    renderListaGradosMaestro() {
        return (
            this.state.gradosMaestro.map((grado) => <div className="gradoMaestro">{grado.nombre} <span onClick={()=> this.quitarGradoAmaestro(grado.id, this.props.maestro.id)} >X</span> </div>)
        )
    }


    renderListaGradosDisponibles() {
        return (
            this.state.gradosDisponibles.map((grado) => <div className="gradoDisponible">{grado.nombre} <span onClick={()=> this.agregarGradoAmaestro(grado.id, this.props.maestro.id)} >Agregar</span> </div>)
        )
    }


    render() {
        return (
            <React.Fragment>

                <MenuItem onClick={() => this.handleClickOpen()}>Editar grados maestro</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Editar grados maestro</div></DialogTitle>
                    <DialogContent>
                        <div className="listasgrados">

                            <h2>Grados asignados</h2>
                            <div className="listadoGrados">
                                {this.state.gradosMaestro == "init" ?
                                    <Cargando />
                                    :
                                    this.renderListaGradosMaestro()
                                }
                            </div>

                            <h2>Grados disponibles</h2>
                            <div className="listadoGradosDisponibles">
                                {this.state.gradosDisponibles == "init" ?
                                    <Cargando />
                                    :
                                    this.renderListaGradosDisponibles()
                                }
                            </div>

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
