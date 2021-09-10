import React, { Component } from 'react'
import moment from 'moment'

export default class Actividad extends Component {


    constructor(props) {
        super(props)

        this.state = {
            numrecursos: 0,
        }
    }




    setNumRecursos(num) {
        this.setState({
            numrecursos: num
        })
    }


    actualizarLista() {
        this.props.fun.getActividdades()
    }

    verActividad(id) {
        this.props.fun.cambiarMenu(2)
        this.props.fun.cambiaActividad(id)
    }

    render() {
        const item = this.props.item

        return (
            <div className="fondoActividadesMaestros">
                <div className="actividadesMaestros">
                    <img className="imagenbackTranspDerBot" src={require("../../../../img/actividades.png")} alt="" />

                    <div className="button buttonUno buttonDelgado buttonVerActividadAlumnos" onClick={() => this.verActividad(item.id)}>Ver</div>

                    <h2 className="nombre">{item.nombre}</h2>
                    <span>{"Fecha limite: " + moment(item.fechaLimite).format("YYYY-MM-DD")}</span>
                    <p className="descripcion">{item.descripcion}</p>
                </div>


            </div>

        )
    }
}
