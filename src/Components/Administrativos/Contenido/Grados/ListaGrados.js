import React, { Component } from 'react'
import "./ListadoGrados.scss"
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';
import AddIcon from '@material-ui/icons/Add';
import GradoAdmin from './GradoAdmin';
import NuevoGrado from './NuevoGrado';


export default class ListadoGrados extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         listadoGrados: "init",

      };
    };

    
    componentDidMount(){
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getGrados()
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarGrado(null)
            this.props.fun.cambiarEstado(1)
        }
      }
    
    getGrados(){
        this.setState({
            listadoGrados: "init"
        })
        request
        .get('/responseLIGDS/grados')
        .set('accept', 'json')
        .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    
                const respuestaLogin =   JSON.parse(res.text);
                this.setState({
                    listadoGrados: respuestaLogin,
                })
                }
        });
    }

    irGrado(grado){
        this.props.fun.cambiarGrado(grado)
        this.props.fun.cambiarEstado(7)
    }

    renderListadoGrados(){

        if (this.state.listadoGrados.length == 0) {
            return <span> Lista de grados vacia</span>
        } else {
            return(
                <div className="listaGrados">
    
                    {this.state.listadoGrados.map((grado) => 
                        <GradoAdmin fun  = { this } grado={ grado }/>
                    ) }
           
                </div>
            )
            
        }


        
    }
    
    render() {
        return (
            <div className="ListadoGrados">
                <div className="NavigationMenu">

                </div>

               <NuevoGrado fun = { this } />


                {this.state.listadoGrados == "init" ?
                    <Cargando/>
                    :
                    this.renderListadoGrados()
                }

            </div>
        )
    }
}
