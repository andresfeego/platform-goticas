import React, { Component } from 'react'
import Usuario from './Usuario'

export default class Header extends Component {
    render() {
        return (
            <div className="HeaderMaestros">
                <img src={require("../../img/logo goticas del saber horizontal.png")} alt=""/>
                <h1 className="textoArea">Area alumnos</h1>
                <Usuario />
            </div>
        )
    }
}
