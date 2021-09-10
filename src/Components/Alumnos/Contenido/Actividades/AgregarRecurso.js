import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Box, Input } from '@material-ui/core';
import request from 'superagent';
import { tiposAlertas, nuevoMensaje } from '../../../../Inicialized/Toast';
import { connect } from 'react-redux';



class AgregarRecurso extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            tipo: '',
            link: '',
            descripcion: '',
            pdf: null,
            imagen: null,
            video: null,

            tiposRecursos: []
        };
    };

    componentDidMount() {
        this.getTiposRecurso()
    }

    getTiposRecurso() {
        request
            .get('/responseLIGDS/tiposRespuesta')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        tiposRecursos: respuestaLogin,
                    })
                }
            });
    }

    handleClickOpen = () => {
        this.setState({
            open: !this.state.open

        })
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    onSelectFilePDF = (e) => {
        var file = e.target.files[0]

        if (file.type != "application/pdf") {
            nuevoMensaje(tiposAlertas.error, "El archivo debe estar en formato pdf")
        } else {
            this.setState({
                pdf: file
            })
        }

    }

    onSelectFileImage = (e) => {
        var file = e.target.files[0]
        if (file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png") {
            this.setState({
                imagen: file
            })
        } else {
            nuevoMensaje(tiposAlertas.error, "Solo se permite cargar imagenes - .jpg .png .jpeg -")
        }

    }

    onSelectFileVideo = (e) => {
        var file = e.target.files[0]
        if (file.type == "video/mp4" || file.type == "video/mpeg" || file.type == "video/wmv") {
            this.setState({
                video: file
            })
        } else {
            nuevoMensaje(tiposAlertas.error, "Solo se permite cargar videos en formato - .mp4 .wmv .mpeg -")
        }

    }


    renderDato2() {
        if (this.state.tipo == 1) {
            return <Input className="inputform" type="file" accept="video/*" className="buttonSelectImage" onChange={this.onSelectFileVideo} />

        } else {
            if (this.state.tipo == 2) {
                return (
                    <FormControl className={this.props.classes.formControl}>
                        <Input className="inputform" type="file" accept="application/pdf" className="buttonSelectImage" onChange={this.onSelectFilePDF} />
                    </FormControl>

                )
            } else {
                if (this.state.tipo == 3) {
                    return (
                        <FormControl className={this.props.classes.formControl}>
                            <Input className="inputform" type="file" accept="image/*" className="buttonSelectImage" onChange={this.onSelectFileImage} />
                        </FormControl>
                    )
                } else {
                    return null
                }
            }
        }
    }

    validarInfo() {
        if (this.state.tipo == 0) {
            nuevoMensaje(tiposAlertas.error, "Debes escoger un tipo de recurso")
        } else {
            if (this.state.tipo == 1 && this.state.video == null) {
                nuevoMensaje(tiposAlertas.error, "Solo se permite cargar imagenes - .mp4 .wmv .mpeg -")
            } else {
                if (this.state.tipo == 2 && this.state.pdf == null) {
                    nuevoMensaje(tiposAlertas.error, "El archivo debe estar en formato pdf")
                } else {
                    if (this.state.tipo == 3 && this.state.imagen == null) {
                        nuevoMensaje(tiposAlertas.error, "Solo se permite cargar imagenes - .jpg .png .jpeg -")
                    } else {
                        return true

                    }
                }
            }
        }
    }

    guardarRecursoDB() {
        request
            .post('/responseLIGDS/agregarRespuesta')
            .send({ tipo: this.state.tipo, link: this.state.link, descripcion: this.state.descripcion, idActividad: this.props.idActividad, idAlumno: this.props.alumnoAdmin.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha agregado la respuesta")
                    this.props.fun.getRespuestas()
                    this.setState({
                        tipo: '',
                        link: '',
                        descripcion: '',
                        pdf: null,
                        imagen: null,
                        video: null
                    })
                    this.handleClickOpen();
                }
            });
    }

    guardarTipoUno() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/uploadReVidRes/' + this.props.idActividad)
            .attach('video', this.state.video)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        link: respuestaLogin.video.filename
                    })
                    this.guardarRecursoDB()


                }
            });
    }

    guardarTipoDos() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/uploadRePdfRes/' + this.props.idActividad)
            .attach('pdf', this.state.pdf)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        link: respuestaLogin.pdf.filename
                    })
                    this.guardarRecursoDB()


                }
            });
    }

    guardarTipoTres() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/uploadReImgRes/' + this.props.idActividad)
            .attach('image', this.state.imagen)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        link: respuestaLogin.image.filename
                    })
                    this.guardarRecursoDB()


                }
            });
    }

    onSubmit = () => {
        if (this.validarInfo()) {
            if (this.state.tipo == 1) {
                this.guardarTipoUno()
            } else {
                if (this.state.tipo == 2) {
                    this.guardarTipoDos()
                } else {
                    this.guardarTipoTres()
                }

            }

        }
    }


    render() {
        return (
            <React.Fragment>

                <Box boxShadow={6} className="button buttonDos" onClick={() => this.handleClickOpen()}>Agregar respuesta</Box>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><h2 className="tituloAgregarActividad">Nueva respuesta</h2></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <FormControl className={this.props.classes.formControl}>
                                    <InputLabel className={this.props.classes.formControlInput} htmlFor="max-width">Tipo de recurso</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.tipo} inputProps={{ name: 'tipo', id: 'tipo' }} >
                                        <MenuItem value={0}>Seleccione tipo de recurso a crear</MenuItem>
                                        {this.state.tiposRecursos.map((tipo) => <MenuItem value={tipo.id}>{tipo.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                {this.renderDato2()}

                                <Input className="inputform" type="text" placeholder="Descripción" value={this.state.descripcion} name="descripcion" onChange={this.onChange} />

                                <div className="button buttonUno buttonDelgado" onClick={this.onSubmit}>Guardar</div>
                            </form>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleClickOpen}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        alumnoAdmin: state.alumnoAdmin
    }
}

export default connect(mapStateToProps)(withStyles({


    formControl: {
        width: '100%',
        margin: "0em 0em 2em 0em",
        minWidth: 120,
    },

    formControlInput: {
    },



})(AgregarRecurso));





