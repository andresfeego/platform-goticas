import React, { Component } from 'react'
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';
import MaestroAdmin from './MaestroAdmin';
import NuevoMaestro from './NuevoMaestro';

export default class ListaMaestros extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listadoMaestros: "init"
        }
    }


    componentDidMount() {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getListaMaestros()
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarEstado(1)
        }
    }

    getListaMaestros() {

        this.setState({
            listadoMaestros: "init"
        })

        request
            .get('/responseLIGDS/maestros')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listadoMaestros: respuestaLogin,
                    })
                }
            });

    }


    renderListadoGrados(){
        if (this.state.listadoMaestros.length == 0) {
            return <span> Lista de maestros vacia</span>
        } else {
            return(
                <div className="listaGrados">
    
                    {this.state.listadoMaestros.map((maestro) => 
                        <MaestroAdmin key={maestro.id} fun  = { this } maestro={ maestro }/>
                    ) }
           
                </div>
            )
            
        }
    }



    render() {
        return (
            <div className="ListadoGrados">
                
                <NuevoMaestro fun = { this } />

                {this.state.listadoMaestros == "init" ?
                    <Cargando/>
                    :
                    this.renderListadoGrados()
                }

            </div>
        )
    }
}
