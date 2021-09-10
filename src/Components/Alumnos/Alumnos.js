import React, { Component } from 'react'
import Header from './Header'
import VentanaAlumnos from './VentanaAlumnos'
import MetaTags from 'react-meta-tags';
import Favicon from 'react-favicon'; 


export default class Alumnos extends Component {
    render() {
        return (
            <div>

                    <Favicon url={require("../../img/favicon.png")} />
                    <div className="wrapper">
                        <MetaTags>
                            <title>- ESTUDIANTES - Liceo infantíl goticas del saber - Tunja, Boyacá</title>
                            <meta name="description" content="Plataforma alumnos - Liceo infantíl goticas del saber - Tunja, Boyacá" />
                            <meta property="og:title" content="Plataforma alumnos - Liceo infantíl goticas del saber - Tunja, Boyacá" />
                            <meta property="og:image" content={require("../../img/logo goticas del saber horizontal.png")} />
                            <meta name="google" content="notranslate"></meta>
                        </MetaTags>
                    </div>


                <Header/>
                <VentanaAlumnos/>
                
            </div>
        )
    }
}
