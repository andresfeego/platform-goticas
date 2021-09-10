import React, { Component } from 'react'
import request from 'superagent'
import { connect } from 'react-redux';
import Actividad from './Actividad'
import VistaActividad from './VistaActividad'
import Cargando from '../../../../Inicialized/Cargando';

class ListaActividades extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaActividades: "init",
            menu: 1,
            currentActividad: 0
        }
    }
    componentDidMount() {
        this.getActividades(this.props.materia.id)

    }

    componentWillReceiveProps(nextP) {
        this.getActividades(nextP.materia.id)

    }


    getActividades(id) {
        request
            .get('/responseLIGDS/actividadesXmateria/' + id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            listaActividades: [],
                        })
                    } else {
                        this.setState({
                            listaActividades: respuestaLogin,
                        })
                    }
                }
            });
    }

    cambiarMenu(menu) {
        this.setState({
            menu: menu
        })
    }

    cambiaActividad(idActividad) {
        this.setState({
            currentActividad: idActividad
        })
    }


    Atras() {
        this.props.fun.cambiaContenido(1)
        this.props.fun.cambiarMateria(null)
        this.props.fun.getMaterias(this.props.idGrado)
    }

    renderListaActividades() {

        if (this.state.listaActividades == "init") {
            return <Cargando />
        } else {
            if (this.state.listaActividades.length > 0) {
                return this.state.listaActividades.map((item) => <Actividad key={item.id} fun={this} item={item} />)
            } else {
                return <span>No hay actividades para esta materia</span>
            }
        }

    }


    renderContenido() {
        switch (this.state.menu) {
            case 1:
                return (

                    <div className="listaActividades">
                        <div className="button buttonUno buttonDelgado" onClick={() => this.Atras()}>{" <=  Atras"}</div>
                        <h1>{this.props.materia.nombre}</h1>

                        {this.renderListaActividades()}
                    </div>
                )

                break;


            case 2:
                return (
                    <div className="listaActividades">
                        <VistaActividad idActividad={this.state.currentActividad} materia={this.props.materia} fun={this} />
                    </div>
                )

                break;

            default:
                break;
        }
    }


    render() {

        return (
            this.renderContenido()
        )
    }
}



const mapStateToProps = (state) => {
    return {
        alumnoAdmin: state.alumnoAdmin
    }
}


export default connect(mapStateToProps)(ListaActividades);