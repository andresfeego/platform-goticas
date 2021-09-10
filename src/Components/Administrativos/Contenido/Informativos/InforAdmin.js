import React, { Component } from 'react'
import "./InforAdmin.scss"
import moment from 'moment'
import YouTube from 'react-youtube';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import { Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditarInformativo from './EditarInformativo';
import EliminarIinformativo from './EliminarIinformativo';

export default class InforAdmin extends Component {


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


    activarDescartivarInformativo(infor) {
        this.handleClickClose()
        let accion = 1
        if (infor.activo == 1) {
            accion = 0
        }
        let labelActivarando = "Activando "
        let labelActivar = "Activar "

        if (accion == 0) {
            labelActivarando = "Desactivando "
            let labelActivar = "Desactivar "
        }

        nuevoMensaje(tiposAlertas.cargando, labelActivarando + "informativo " + infor.id);
        request
            .post('/responseLIGDS/activarDescartivarInfor')
            .set('accept', 'json')
            .send({ accion: accion, id: infor.id })
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al " + labelActivar + " informativo: " + err, 3000);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Informativo actualizado", 1000);
                    this.props.fun.getInformativos();
                }
            });
    }

    renderMultimedia(item) {

        switch (item.tipo) {
            case 1:
                const opts = {

                    playerVars: {
                        // https://developers.google.com/youtube/player_parameters
                        autoplay: 0,
                    },
                };

               

                return (
                    <YouTube videoId={item.link} opts={opts} className="mediaRecurso mediaRecursoInfor Youtube" onReady={this._onReady} />
                )

                break;



            case 2:
                return (
                    <img className="mediaRecurso mediaRecursoInfor" src={"./recursosInformativos/" + item.link} alt="" />
                )
                break;


            default:
                return ("Imposible leer recurso")
                break;
        }
    }


    render() {
        const infor = this.props.informativo
        let visual = "Activar"
        if (infor.activo == 1) {
            visual = "Desactivar"
        }
        return (
            <div className="informativo">

                <h1 className={"titulo " + visual}> {infor.titulo} </h1>
                {infor.activo == 1 ?
                    <VisibilityIcon className="visibilityicon" />
                    :
                    <VisibilityOffIcon className="visibilityicon" />
                }

                <div className="multimedia">
                    {this.renderMultimedia(infor)}
                </div>

                <div className="fechas">
                    <div className="fechaCreacion"><span>Fecha Creación: </span>{moment(infor.fechaCreacion).format("YYYY-MM-DD")}</div>
                    <div className="fechaPublicacion"><span>Fecha Publicación: </span>{moment(infor.fechaPublicacion).format("YYYY-MM-DD")}</div>
                    <div className="fechaPublicacion"><span>Fecha Fin: </span>{moment(infor.fechaFin).format("YYYY-MM-DD")}</div>
                    <div className="fechaPublicacion"><span>Publico: </span>{infor.nombreGrado}</div>
                </div>

                <div className="texto"> {infor.descripcion} </div>

                <div className="menuInforAdmin" onClick={this.handleClickOpen}>
                    <MoreVertIcon />
                </div>
                
                <Menu id="simple-menu" anchorEl={this.state.setAnchorEl} keepMounted open={this.state.open} onClose={this.handleClickOpen}>
                    <MenuItem onClick={() => this.activarDescartivarInformativo(infor)}>{infor.activo == 0 ? "Activar": "Desactivar"}</MenuItem>
                    <EditarInformativo informativo = { infor } fun={this}  fun2={this.props.fun} />
                    <EliminarIinformativo informativo = { infor } fun={this}  fun2={this.props.fun} />
                </Menu>

            </div>
        )
    }
}
