import React, { Component } from 'react'
import "./ListadoAlumnos.scss"
import request from 'superagent';
import AlumnoAdmin from './AlumnoAdmin';
import Cargando from '../../../../Inicialized/Cargando';
import { Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AgregarAlumno from './AgregarAlumno';


var buscar

export default class ListadoAlumnos extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listadoAlumnos: "init",
            listadoAlumnosOriginal: [],
            busqueda: "",

        }
    }

    componentDidMount() {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getAlumnos()
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarEstado(2)
            this.props.fun.cambiarGrado(null)
        }
    }

    onChange = e => {

        clearTimeout(buscar)
        var value = e.target.value
        this.setState({
            [e.target.name]: value
        })

        buscar = setTimeout(() => this.buscar(value), 500);

    }

    buscar(busqueda) {
        this.setState({
            listadoAlumnos: "init",
        })

        if (busqueda == "") {

            this.setState({
                listadoAlumnos: this.state.listadoAlumnosOriginal,
            })

        } else {

            var prepBus = new RegExp(busqueda, 'i'); // preparando termino de busqueda
            let estudiantesAuxi = this.state.listadoAlumnosOriginal.filter((item) => {
                if (prepBus.test(item.nombre) || prepBus.test(item.apellidos) || prepBus.test(item.usuario)) {
                    return true
                } else {
                    return false
                }
            });
            if (estudiantesAuxi.length == 0) {
                estudiantesAuxi = "vacio"
            }
            this.setState({
                listadoAlumnos: estudiantesAuxi,
            })

        }
    }


    getAlumnos() {

        this.setState({
            listadoAlumnos: "init"
        })

        var listado = []

        if (this.props.grado == 0) {
            request
                .get('/responseLIGDS/alumnos')
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);

                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        listado  = respuestaLogin

                        request
                        .get('/responseLIGDS/alumnosSinGrado')
                        .set('accept', 'json')
                        .end((err, res) => {
                            if (err) {
                                console.log(err);
                                this.setState({
                                    listadoAlumnos: listado,
                                    listadoAlumnosOriginal: listado,
                                    busqueda: ""
                                })
        
                            } else {
        
                                const respuestaLogin = JSON.parse(res.text);
                                if (respuestaLogin.length > 0 ) {
                                    listado = listado.concat(respuestaLogin)
                                }
                                this.setState({
                                    listadoAlumnos: listado,
                                    listadoAlumnosOriginal: listado,
                                    busqueda: ""
                                })
                        
                            }
                        });
        
                        
                    }
                });

               
                
        } else {
            request
                .get('/responseLIGDS/alumnosXgrado/' + this.props.grado.id)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);

                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        this.setState({
                            listadoAlumnos: respuestaLogin,
                            listadoAlumnosOriginal: respuestaLogin,
                            busqueda: ""


                        })
                    }
                });
        }
    }

    renderListaAlumnos() {
        if (this.state.listadoAlumnos == "init") {
            return <Cargando />
        } else {
            if (this.state.listadoAlumnos == "vacio" ||this.state.listadoAlumnos.length == 0) {
                return <span className="vacio">No hay coincidencias</span>
            } else {
                return (
                    <div className="listaAlumnosAdmin">
                        {this.state.listadoAlumnos.map((alumno) =>
                            <AlumnoAdmin alumno={alumno} grado={this.props.grado} fun={this} />
                        )}
                    </div>
                )
            }
        }
    }

    render() {
        return (



            <div className="ListadoAlumnos">

                <div className="barraUp">
                    {this.props.grado ? <h2> { "Listado de alumnos grado " + this.props.grado.nombre } </h2> : <h2> Listado de todos los alumnos </h2>  }
                    <div className="filtrosContainer buElement">
                        <div className={"filtros "}>
                            <Input className="inputform" type="text" placeholder="Buscar por id o nombre del curso" value={this.state.busqueda} name="busqueda" onChange={this.onChange} />
                            {this.state.busqueda != "" ?
                                <div className="cerrarBusqueda" onClick={() => {this.setState({busqueda: ""}); buscar = setTimeout(() => this.buscar(""), 500);
                            }}>X</div>
                                :
                                null}
                        </div>
                        <AgregarAlumno grado={this.props.grado} fun={this}/>
                    </div>


                </div>

                {this.state.listadoAlumnos != "init" ?
                    this.renderListaAlumnos()
                    :
                    <Cargando />
                }
            </div>

        )
    }
}
