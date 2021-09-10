import React, { Component } from 'react'
import "./ContenidoGrado.scss"
import ListaAlumnos from './Alumnos/ListaAlumnos'
import ListaMaterias from './Actividades/ListaMaterias'
import { connect } from 'react-redux';
import { saveMaestro } from '../../../../Inicialized/Actions';



class ContenidoGrado extends Component {

    constructor(props) {
        super(props)
        this.state = {
            grado: this.props.grado,
            menu: 1,

        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            grado: nextProps.grado,

        })

    }

    cambiarMenu(menu) {
        this.setState({
            menu
        })
    }

    cambiarMateria(materia) {
        this.setState({
            currentMateria: materia
        })
    }

    curvasActivo(id) {

        if (id == this.state.menu) {
            return "buttonContenidoGradosActivo"
        } else {
            return "buttonContenidoGradosInactivo"
        }

    }

    renderContenido() {
        switch (this.state.menu) {

            case 1:
                return <ListaMaterias idGrado={this.props.grado.id} nombreGrado={this.props.grado.nombre} fun={this} />
                break;

            case 2:
                return <ListaAlumnos idGrado={this.props.grado.id} />
                break;

            default:
                break;
        }
    }

    renderContenidoGrado() {
        if (this.state.grado == 0) {
            return (
                <div className="ContenidoGrado">
                    <span>Cargando grados...</span>
                </div>
            )

        } else {
            return (
                <div className="ContenidoGrado">
                    <div className="tituloGrado">
                        {this.state.grado.nombre}
                    </div>

                    <div className="salaYActividades">

                        {/* <Iframe 
                            width="100%"
                            id="105757752432"
                            className="sala"
                            display="initial"
                            src={"https://us05web.zoom.us/j/83923926899?pwd=dWUzRldCL2Q0U29EeWtyVEFDVlByZz09"} 
                            allow="camera; microphone; fullscreen; display-capture"
                            position="relative"/> */}



                        <div className="actividad">
                            <div className="botoneraContenidoGrados">
                                <div className={"buttonContenidoGrados " + this.curvasActivo(1)} onClick={() => this.cambiarMenu(1)} >Actividades</div>
                                <div className={"buttonContenidoGrados " + this.curvasActivo(2)} onClick={() => this.cambiarMenu(2)} >Alumnos</div>
                            </div>
                            {this.renderContenido()}
                        </div>

                    </div>

                </div>
            )
        }
    }

    render() {
        return (

            this.renderContenidoGrado()

        )
    }
}



const mapStateToProps = (state) => {
    return {
        maestroAdmin: state.maestroAdmin
    }
}

const mapDispatchToProps = {
    saveMaestro

}

export default connect(mapStateToProps, mapDispatchToProps)(ContenidoGrado);