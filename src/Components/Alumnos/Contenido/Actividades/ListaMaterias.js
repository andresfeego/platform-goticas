import React, { Component } from 'react'
import ListaActividades from './ListaActividades'
import Materia from './Materia'
import request from 'superagent'
import Cargando from '../../../../Inicialized/Cargando'

export default class ListaMaterias extends Component {

    constructor(props) {
        super(props)

        this.state = {
            menu: 1,
            currentMateria: null,
            listaMaterias: "init"

        }
    }

    componentDidMount() {
        this.getMaterias(this.props.idGrado)
        window.history.pushState(null, null, window.location.pathname);
    }

    componentWillReceiveProps(nextProps) {
        this.getMaterias(nextProps.idGrado)
    }



    getMaterias(idGrado) {
        request
            .get('/responseLIGDS/materiasXgrado/' + idGrado)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            listaMaterias: [],
                        })
                    } else {
                        this.setState({
                            listaMaterias: respuestaLogin,
                        })
                    }
                }
            });
    }


    cambiaContenido(menu) {
        this.setState({
            menu: menu
        })
    }

    cambiarMateria(materia) {
        this.setState({
            currentMateria: materia
        })
    }


    renderMaterias() {

        if (this.state.listaMaterias == "init") {
            return <Cargando />
        } else {
            if (this.state.listaMaterias.length > 0) {
                return (
                    <div className="listaActividades">
                        <h1>Lista de materias</h1>
                        {this.state.listaMaterias.map((item) => <Materia materia={item} fun={this} idGrado={this.props.idGrado} />)}
                    </div>
                )
            } else {
                return (
                    <div className="listaActividades">
                        Lista de materias vacia
                    </div>
                )
            }
        }


    }


    renderListaMaterias() {
        switch (this.state.menu) {

            case 1:
                return this.renderMaterias()
                break;

            case 2:
                return <ListaActividades idGrado={this.props.idGrado} nombreGrado={this.props.nombreGrado} materia={this.state.currentMateria} fun={this} />
                break;

            default:
                break;
        }
    }

    render() {
        return (
            this.renderListaMaterias()
        )
    }
}
