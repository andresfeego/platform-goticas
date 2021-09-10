import React, { Component } from 'react'
import "./Contenido.scss"
import ContenidoAlumnos from './ContenidoAlumnos'
import { connect } from 'react-redux';
import { saveAlumno } from '../../../Inicialized/Actions';

class Contenido extends Component {

    constructor(props) {
        super(props)

        this.state = {
            menu: 1,

        };
    };

    cambiarMenu(id) {
        this.setState({
            menu: id,
        })
    }

    buttonActivo(menu) {

        if (this.state.menu == menu) {
            return "buttonActivo"
        } else {
            return ''
        }

    }


    render() {
        return (
            <div className="ContenidoMaestros">

                <div className="Botonera">
                    <div className={"button buttonUno buttonDelgado buttonMargin1 " + this.buttonActivo(1)} onClick={() => this.cambiarMenu(1)}>Mis actividades</div>
                    <div className={"button buttonUno buttonDelgado buttonMargin1 " + this.buttonActivo(2)} onClick={() => this.cambiarMenu(2)}>Mis Informativos</div>
                </div>
                <ContenidoAlumnos fun={this} menu={this.state.menu} usuario={this.props.alumnoAdmin} />

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        alumnoAdmin: state.alumnoAdmin
    }
}

const mapDispatchToProps = {
    saveAlumno

}

export default connect(mapStateToProps, mapDispatchToProps)(Contenido);