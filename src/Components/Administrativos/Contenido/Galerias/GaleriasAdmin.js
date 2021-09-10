import React, { Component } from 'react'
import request from 'superagent'
import Cargando from '../../../../Inicialized/Cargando'
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast'
import AgregarGaleria from './AgregarGaleria'
import GaleriaAdmin from './GaleriaAdmin'
import "./GaleriasAdmin.scss"

export default class GaleriasAdmin extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            listaGalerias: "init"
        }
    }

    componentDidMount(){
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getGalerias()
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarEstado(1)
        }
      }

      getGalerias(){
        request
        .get('/responseLIGDS/galerias')
        .set('accept', 'json')
        .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    
                const respuestaLogin =   JSON.parse(res.text);
                this.setState({
                    listaGalerias: respuestaLogin,
                })
                }
        });
    }

    moverOrdenGaleria(from, to){

        return new Promise((resolve, reject) => {
            request
            .post('/responseLIGDS/moverOrdenGaleria')
            .send({ from: from, to: to })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    reject( "Error al guardar información")
        
                } else {
                    resolve()
                }
            });
        

        })
        
    }

  
    moverArriba(index){
        nuevoMensaje(tiposAlertas.cargando, "Moviendo...")
        const lista = this.state.listaGalerias
        this.moverOrdenGaleria(lista[index].orden, lista[index-1].orden).then(() => {
            nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
            this.getGalerias()
        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
        
    }

    moverAbajo(index){
        nuevoMensaje(tiposAlertas.cargando, "Moviendo...")
        const lista = this.state.listaGalerias
        this.moverOrdenGaleria(lista[index].orden, lista[index+1].orden).then(() => {
            nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
            this.getGalerias()
        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }

    renderListaGalerias(){

        if (this.state.listaGalerias.length == 0) {
            return (

                <div className="listaGalerias">
                <span>No hay galerias de fotos</span>
                </div>
                )
            
        } else {
            return(
                <div className="listaGalerias">
                    {this.state.listaGalerias.map((galeria, index) => 
                        <GaleriaAdmin galeria={galeria} index={index} finLista={this.state.listaGalerias.length} fun={this} fun2={this.props.fun}/>
                    )}
                </div>
            )
            
        }

    }

    
    render() {
        return (
            <div className="adminInfor">
                <AgregarGaleria fun={this} />

                { this.state.listaGalerias == "init"? 
                        <Cargando/>
                    :
                        this.renderListaGalerias()
                }
            </div>
        )
    }
}
