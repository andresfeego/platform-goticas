import React, { Component } from 'react'
import "./ContenidoAlumnos.scss"
import ListaInformativos from './Informativos/ListaInformativos'
import ListaMaterias from './Actividades/ListaMaterias'
import request from 'superagent'
import { nuevoMensaje, tiposAlertas } from '../../../Inicialized/Toast'
import Cargando from '../../../Inicialized/Cargando'


export default class ContenidoAlumnos extends Component {

    constructor(props) {
        super(props)

        this.state = {
            grado: undefined
        }
    }


    componentDidMount() {
        this.getGrado(this.props.usuario.idGrado)
    }

    componentWillReceiveProps(nextProps) {
        this.getGrado(nextProps.usuario.idGrado)
    }


    getGrado(id) {
        //alert(this.props.usuario.idGrado)
        request
            .get('/responseLIGDS/gradoxid/' + id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.error, "Error al intentar consultar la sala");

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        grado: respuestaLogin[0],
                    })
                }
            });

    }

    renderContenido() {
        switch (this.props.menu) {
            case 1:
                return <ListaMaterias idGrado={this.props.usuario.idGrado} />
                break;

            case 2:
                return <ListaInformativos idGrado={this.props.usuario.idGrado} />
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <div className="ContenidoAlumno">

                {this.state.grado == undefined ?
                    <Cargando />
                    :
                    <div className="salaYActividades">
                        {/*        <Iframe 
                            width="100%"
                            id="105757752432"
                            className="sala"
                            display="initial"
                            src={"https://8x8.vc" + this.state.grado.sala} 
                            allow="camera; microphone; fullscreen; display-capture"
                            position="relative"/> */}
                        <h3>{this.props.usuario.nombreGrado}</h3>
                        <div className="actividad">
                            {this.renderContenido()}
                        </div>

                    </div>
                }
            </div>
        )
    }
}
