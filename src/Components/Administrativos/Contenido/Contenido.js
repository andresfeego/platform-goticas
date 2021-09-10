import React, { Component } from 'react'
import { Menu } from '@material-ui/core'
import MenuUsuario from './MenuUsuario'
import "./Contenido.scss"
import ListadoGradosAlumnos from './Alumnos/ListadoGradosAlumnos'
import ListadoAlumnos from './Alumnos/ListadoAlumnos'
import InformativosAdmin from './Informativos/InformativosAdmin'
import AgregarInformativo from './Informativos/AgregarInformativo'
import ListadoGrados from './Grados/ListaGrados'
import ListadoAlumnosGrados from './Grados/ListadoAlumnosGrados'
import ListaMaestros from './Maestros/ListaMaestros'
import GaleriasAdmin from './Galerias/GaleriasAdmin'
import VerGaleria from './Galerias/VerGaleria'

export default class Contenido extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             estado:  1,
             grado: null,
             galeria: null
        }
    }
    
    cambiarEstado(nuevoEstado){
        this.setState({
            estado: nuevoEstado
        })
    }

    
    cambiarGrado(nuevoGrado){
        this.setState({
            grado: nuevoGrado
        })
    }

    cambiarGaleria(nuevaGaleria){
        this.setState({
            galeria: nuevaGaleria
        })
    }


    renderContenido(){
        switch (this.state.estado) {
            case 1:
                return <MenuUsuario fun={this}/>
                break; 

            case 2:
                return <ListadoGradosAlumnos fun={this}/>
                break; 

            case 3:
                return <ListadoAlumnos fun={this} grado={this.state.grado}/>
                break; 

            case 4:
                return <InformativosAdmin fun={this}/>
                break;
                
            case 5:
                return <AgregarInformativo fun={this}/>
                break;

            case 6:
                return <ListadoGrados fun={this}/>
                break; 

            case 7:
                return <ListadoAlumnosGrados fun={this} grado={this.state.grado}/>
                break; 

            case 8:
                return <ListaMaestros fun={this} />
                break; 
    
                
            case 9:
                return <GaleriasAdmin fun={this} />
                break; 

            case 10:
                return <VerGaleria galeria={this.state.galeria} fun={this} />
                break; 

                    
    
            default:
                break;
        }
    }

    render() {
        return (
            <div className="ContenidoUsuario">
                {this.renderContenido()}
            </div>
        )
    }
}
