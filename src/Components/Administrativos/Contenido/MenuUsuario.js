import React, { Component } from 'react'
import "./MenuUsuario.scss"



export default class MenuUsuario extends Component {
    render() {
        return (
            <div className="MenuUsuario">
                <div className="ItemMenuUsu" onClick={()=> this.props.fun.cambiarEstado(2)}>
                    <img src={require("../../../img/alumnos.png")} alt=""/>
                    <span>Alumnos</span>
                </div>
                
                <div className="ItemMenuUsu" onClick={()=> this.props.fun.cambiarEstado(6)}>
                    <img src={require("../../../img/grados.png")} alt=""/>
                    <span>Grados</span>
                </div>

                <div className="ItemMenuUsu" onClick={()=> this.props.fun.cambiarEstado(8)}>
                    <img src={require("../../../img/profesores.png")} alt=""/>
                    <span>Maestros</span>
                </div>
                
                <div className="ItemMenuUsu" onClick={()=> this.props.fun.cambiarEstado(4)}>
                    <img src={require("../../../img/informativos.png")} alt=""/>
                    <span>Informativos</span>
                </div>
                
                <div className="ItemMenuUsu" onClick={()=> this.props.fun.cambiarEstado(9)}>
                    <img src={require("../../../img/galerias.png")} alt=""/>
                    <span>Galerías</span>
                </div>

            </div>
        )
    }
}
