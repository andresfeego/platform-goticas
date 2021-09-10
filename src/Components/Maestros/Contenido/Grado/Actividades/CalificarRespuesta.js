import React, { Component } from 'react'
import "./CalificarRespuesta.scss"
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Input } from '@material-ui/core'
import { nuevoMensaje, tiposAlertas } from '../../../../../Inicialized/Toast'
import request from 'superagent'

export default class CalificarRespuesta extends Component {


    constructor(props) {
        super(props)

        this.state = {
            calificacion: this.props.respuesta.calificacion
        }
    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }



    renderCalificador() {
        var grado = this.props.respuesta.idGrado

        if (grado == 1 || grado == 2) {

            return (
                <FormControl component="fieldset">
                    <FormLabel component="legend">Calificación</FormLabel>
                    <RadioGroup aria-label="tipo" className="radioGroup" name="calificacion" value={this.state.calificacion} onChange={this.onChange}>
                        <FormControlLabel
                            value='0'
                            control={<Radio color="primary" />}
                            label="Carita Triste"
                        />
                        <FormControlLabel
                            value='1'
                            control={<Radio color="primary" />}
                            label="Carita Feliz"
                        />

                    </RadioGroup>
                </FormControl>
            )
        } else {
            if (grado == 3 || grado == 4 || grado == 5) {

                return (
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Calificación</FormLabel>
                        <RadioGroup aria-label="tipo" className="radioGroup" name="calificacion" value={this.state.calificacion} onChange={this.onChange}>
                            <FormControlLabel
                                value='E'
                                control={<Radio color="primary" />}
                                label="Excelente"
                            />
                            <FormControlLabel
                                value='S'
                                control={<Radio color="primary" />}
                                label="Sobresaliente"
                            />


                            <FormControlLabel
                                value='A'
                                control={<Radio color="primary" />}
                                label="Aceptable"
                            />


                            <FormControlLabel
                                value='D'
                                control={<Radio color="primary" />}
                                label="Deficiente"
                            />


                            <FormControlLabel
                                value='I'
                                control={<Radio color="primary" />}
                                label="Insuficiente"
                            />


                        </RadioGroup>
                    </FormControl>
                )

            } else {
                return (
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Calificación</FormLabel>
                        <Input className="inputform" type="text" placeholder="Calificación numerica" value={this.state.calificacion} name="calificacion" onChange={this.onChange} />
                    </FormControl>
                )
            }

        }

    }

    calificar() {
        nuevoMensaje(tiposAlertas.cargando, "Actualizando calificación")
        request
            .post('/responseLIGDS/actualizarCalificacion')
            .send({ calificacion: this.state.calificacion, idRespuesta: this.props.respuesta.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar, intenta de nuevo en unos minutos")
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Calificación actualizada")
                }
            });
    }


    validarInfo() {
        if (this.state.calificacion == null) {
            nuevoMensaje(tiposAlertas.error, "No has ingresado ninguna calificación")
        } else {
            if (this.props.respuesta.idGrado >= 6) {
                var calificacion = parseInt(this.state.calificacion)
                if (calificacion >= 0 && calificacion <= 5) {
                    return true
                } else {
                    nuevoMensaje(tiposAlertas.error, "La calificación debe estar entre 0 y 5")
                }
            } else {
                return true
            }
        }
    }

    guardar() {
        if (this.validarInfo()) {
            this.calificar()
        }
    }


    render() {
        return (
            <div className="contenidoActividad CalificarRespuestas">
                {this.renderCalificador()}
                <div className="button buttonUno buttonDelgado" onClick={() => this.guardar()}>Guardar calificación</div>
            </div>
        )
    }
}
