import React, { Component } from 'react'
import Cargando from '../../../../../Inicialized/Cargando';
import Alumno from './Alumno'
import request from 'superagent'

export default class ListaAumnos extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaAlumnos: "init"
        }
    }

    componentDidMount() {
        this.getAlumnos(this.props.idGrado)
    }

    componentWillReceiveProps(nextProps) {
        this.getAlumnos(nextProps.idGrado)
    }

    getAlumnos(idGrado) {
        request
            .get('/responseLIGDS/alumnosXgrado/' + idGrado)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            listaAlumnos: [],
                        })
                    } else {
                        this.setState({
                            listaAlumnos: respuestaLogin,
                        })
                    }
                }
            });
    }

    renderLista() {
        if (this.state.listaAlumnos == "init") {
            return <Cargando />
        } else {
            if (this.state.listaAlumnos.length == 0) {
                return (
                    <div className="listaActividades">
                        <span>No hay alumnos en este grado</span>
                    </div>
                )
            } else {
                return (
                    <div className="listaActividades">
                        {this.state.listaAlumnos.map((item) => <Alumno alumno={item} />)}
                    </div>
                )
            }
        }
    }


    render() {
        return (

            this.renderLista()
        )
    }
}
