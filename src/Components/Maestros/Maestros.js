import React, { Component } from 'react'
import Header from './Header'
import VentanaMaestros from './VentanaMaestros'
import MetaTags from 'react-meta-tags';
import Favicon from 'react-favicon';


export default class Maestros extends Component {
    render() {
        return (
            <div>

                    <Favicon url={require("../../img/favicon.png")} />
                    <div className="wrapper">
                        <MetaTags>
                            <title>- MAESTROS - Liceo infantíl goticas del saber - Tunja, Boyacá</title>
                            <meta name="description" content="Plataforma maestros - Liceo infantíl goticas del saber - Tunja, Boyacá" />
                            <meta property="og:title" content="Plataforma maestros - Liceo infantíl goticas del saber - Tunja, Boyacá" />
                            <meta property="og:image" content={require("../../img/logo goticas del saber horizontal.png")} />
                            <meta name="google" content="notranslate"></meta>
                        </MetaTags>
                    </div>



                <Header/>
                <VentanaMaestros/>

            </div>
        )
    }
}
