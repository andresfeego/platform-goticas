import React, { Component } from 'react'
import YouTube from 'react-youtube'
import request from 'superagent'
import Cargando from '../../../../Inicialized/Cargando'
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast'
import "./ListaInformativos.scss"


export default class ListaInformativos extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaInfomativos: "init"
        }
    }



    componentDidMount() {
        this.getInformativos(this.props.idGrado)
    }


    getInformativos() {
        //alert(this.props.usuario.idGrado)
        request
            .get('/responseLIGDS/informativosXgrado/' + this.props.idGrado)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.error, "Error al intentar consultar la sala");

                } else {

                    const respuestaLogin = JSON.parse(res.text);

                    this.setState({
                        listaInfomativos: respuestaLogin,
                    })
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
                    <YouTube videoId={item.link} opts={opts} className="mediaRecurso YoutubeInfo" onReady={this._onReady} />
                )

                break;



            case 2:
                return (
                    <img className="mediaRecurso" src={require("../../../../recursosInformativos/imagenes/" + item.link)} alt="" />
                )
                break;


            default:
                return ("Imposible leer recurso")
                break;
        }
    }


    renderListadoInfor() {
        if (this.state.listaInfomativos.length == 0) {
            return <span>Sin informativos para este grado</span>
        } else {
            return (
                this.state.listaInfomativos.map((infor) =>
                    <div className="informativoGrado">
                        <h2>{infor.titulo}</h2>

                        <div className="multimedia">
                            {this.renderMultimedia(infor)}
                        </div>

                        <p className="descripcion">{infor.descripcion}</p>

                        {infor.linkActivo == 1 && (
                            <a className="boton" href={infor.linkExterno} target="_black">
                                <span>Ver</span>
                            </a>
                        )}

                    </div>
                )
            )
        }
    }


    render() {
        return (
            <div className="listaActividades">
                {this.state.listaInfomativos == "init" ?
                    <Cargando />
                    :
                    this.renderListadoInfor()
                }
            </div>
        )
    }
}
