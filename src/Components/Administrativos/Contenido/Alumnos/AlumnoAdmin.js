import React, { Component } from 'react'
import "./AlumnoAdmin.scss"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import EditarAlumno from './EditarAlumno';

export default class AlumnoAdmin extends Component {


    constructor(props) {
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

    activarAlumno = (id) => {

        nuevoMensaje(tiposAlertas.cargando, "Activando alumno " + id);
        request
            .post('/responseLIGDS/activarAlumno/' + id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al activar alumno: " + err, 3000);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Alumno actualizado", 1000);
                    this.props.fun.getAlumnos();
                }
            });
        this.handleClickClose();


    }

    desactivarAlumno = (id) => {

        nuevoMensaje(tiposAlertas.cargando, "Desactivando alumno " + id);
        request
            .post('/responseLIGDS/desactivarAlumno/' + id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al desactivar alumno: " + err, 3000);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Alumno actualizado", 1000);
                    this.props.fun.getAlumnos();
                }
            });

        this.handleClickClose();

    }

    quitarAlumnoGrado(idAlumno, idGrado) {
        nuevoMensaje(tiposAlertas.cargando, "Quitando alumno " + idAlumno);
        request
            .post('/responseLIGDS/quitarAlumnoGrado')
            .send({ idAlumno: idAlumno, idGrado: idGrado })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al quitar alumno: " + err, 3000);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Alumno actualizado", 1000);
                    this.props.fun.getAlumnos();
                }
            });

        this.handleClickClose();

    }


    render() {
        const alumno = this.props.alumno
        var classActivo = "alumnoActivo"
        if (alumno.activo == 0) {
            classActivo = "alumnoInactivo"
        }
        return (
            <div className="alumnoAdmin">
                <h1 className={"nombreAlumno " + classActivo}>{alumno.nombre.toProperCase() + " " + alumno.apellidos.toProperCase()}</h1>

                <div className="datosAlumno">
                    <span className="datoAlmun">{"Número de registro: " + alumno.usuario}</span>

                    {alumno.correo ? <span className="datoAlmun">Correo: <a href={"mailto:" + alumno.correo}> {alumno.correo} </a></span> : <span>Correo: Sin correo</span>}
                    {alumno.telefonoContacto ? <span className="datoAlmun">Telefono de contacto: <a href={"tel:" + alumno.telefonoContacto}>{alumno.telefonoContacto}</a></span> : <span className="datoAlmun">Telefono de contacto: Sin telefono de contacto</span>}
                    {!alumno.nombreGrado ? <span>Grado: Sin grado </span> : <span>{"Grado: " + alumno.nombreGrado}</span>}
                    {alumno.activo == 1 ? "Estado: Activo " : "Estado: Inactivo "}

                </div>


                <div className="menuAlumno" onClick={this.handleClickOpen}>
                    <MoreVertIcon />
                </div>

                <Menu
                    id="simple-menu"
                    anchorEl={this.state.setAnchorEl}
                    keepMounted
                    open={this.state.open}
                    onClose={this.handleClickOpen}
                >
                    {alumno.activo == 1 ?
                        <MenuItem onClick={() => this.desactivarAlumno(alumno.id)}>Desactivar</MenuItem>
                        :
                        <MenuItem onClick={() => this.activarAlumno(alumno.id)}>Activar</MenuItem>
                    }
                    <EditarAlumno funDos={this.props.fun} fun={this} alumno={alumno} />
                    {!this.props.grado ? null : <MenuItem onClick={() => this.quitarAlumnoGrado(alumno.id, this.props.grado.id)}>Quitar de este grado</MenuItem>}
                </Menu>
            </div>
        )
    }
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};
