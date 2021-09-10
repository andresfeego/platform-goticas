import React, { Component } from 'react'
import "./ListadoGrados.scss"
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';


export default class ListadoGradosAlumnos extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         listadoGrados: [],

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
        this.props.fun.cambiarEstado(3)
    }

    renderListadoGrados(){

        return(
            <div className="listaGrados">

                <div className="gradoAdmin todosAlumnos" onClick={()=> this.irGrado(0)}>Todos los alumnos</div>

                {this.state.listadoGrados.map((grado) => 
                    <div className="gradoAdmin" onClick={()=> this.irGrado(grado)}>{grado.nombre}</div>
                ) }
       
            </div>
        )

        
    }
    
    render() {
        return (
            <div className="ListadoGrados">
                <div className="NavigationMenu">

                </div>

                {this.state.listadoGrados.length > 0 ?
                    this.renderListadoGrados()
                    :
                    <Cargando/>
                }

            </div>
        )
    }
}
