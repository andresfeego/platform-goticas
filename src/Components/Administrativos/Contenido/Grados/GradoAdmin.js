import React, { Component } from 'react'
import "./GradoAdmin.scss"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditarGrado from './EditarGrado';
import AgregarAlumnoGrado from './AgregarAlumnoGrado';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';



export default class GradoAdmin extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false,
            setAnchorEl: null
        }
    }

    handleClickOpen = (event) => {
        this.setState({
            open: !this.state.open,
            setAnchorEl: event.currentTarget
        })
    };

    handleClickClose = () => {
        this.setState({
            open: !this.state.open,
            setAnchorEl: null

        })
    };

    quitarAlumnosXGrado(grado) {
        nuevoMensaje(tiposAlertas.cargando, "Quitando alumnos del grado " + grado.nombre);
        request
            .post('/responseLIGDS/quitarAlumnosXGrado')
            .send({idGrado: grado.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al quitar alumnos: " + err, 3000);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Lista actualizada", 1000);
                }
            });

        this.handleClickClose();

    }


    render() {

        const grado = this.props.grado
        return (
            <div className="gradoAdmin">
                <span onClick={() => this.props.fun.irGrado(grado)}>{grado.nombre}</span>

                <div className="menuGrado" onClick={this.handleClickOpen}>
                    <MoreVertIcon />
                </div>

                <Menu id="simple-menu" anchorEl={this.state.setAnchorEl} keepMounted open={this.state.open} onClose={this.handleClickOpen}>
                        <AgregarAlumnoGrado grado={grado} fun = {this} fun2={this.props.fun}/>
                        <MenuItem onClick={() => this.props.fun.irGrado(grado)}>Lista alumnos</MenuItem>
                        <EditarGrado grado={grado} fun = {this} fun2={this.props.fun}/>
                        <MenuItem onClick={() => this.quitarAlumnosXGrado(grado)}>Quitar todos los alumnos del grado</MenuItem>
                </Menu>

            </div>
        )
    }
}
