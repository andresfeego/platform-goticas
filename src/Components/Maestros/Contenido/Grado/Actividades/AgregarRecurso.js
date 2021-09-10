import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Box, Input } from '@material-ui/core';
import request from 'superagent';
import { tiposAlertas, nuevoMensaje } from '../../../../../Inicialized/Toast';



class AgregarRecurso extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            tipo: 0,
            link: '',
            descripcion: '',
            pdf: null,
            imagen: null,

            tiposRecursos: []
        };
    };

    componentDidMount() {
        this.getTiposRecurso()
    }

    getTiposRecurso() {
        request
            .get('/responseLIGDS/tiposRecursos')
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
            open: !this.state.open,
            tipo: 0

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
        console.log(file.type)
        if (file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png") {
            this.setState({
                imagen: file
            })
        } else {
            nuevoMensaje(tiposAlertas.error, "Solo se permite cargar imagenes - .jpg .png .jpeg -")
        }

    }


    renderDato2() {
        if (this.state.tipo == 1) {
            return <Input className="inputform" type="text" placeholder="Link" value={this.state.link} name="link" onChange={this.onChange} />
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

            if (this.state.tipo == 2 && this.state.pdf == null) {
                nuevoMensaje(tiposAlertas.error, "El archivo debe estar en formato pdf")
            } else {
                if (this.state.tipo == 3 && this.state.imagen == null) {
                    nuevoMensaje(tiposAlertas.error, "Solo se permite cargar imagenes - .jpg .png .jpeg -")
                } else {
                    if (this.state.descripcion == '') {
                        nuevoMensaje(tiposAlertas.error, "Debes agregar una descripción para este recurso")
                    } else {
                        if (this.state.tipo == 1 && this.state.link == '') {
                            nuevoMensaje(tiposAlertas.error, "Debes agregar un link")
                        } else {
                            if (this.state.tipo == 1) {
                                var video_id = this.state.link.split('.be/')[1];

                                if (!video_id) {

                                    video_id = this.state.link.split('v=')[1];

                                    if (!video_id) {
                                        nuevoMensaje(tiposAlertas.error, "El tipo de link no es valido, solo se permiten links de youtube")
                                    } else {
                                        return true
                                    }
                                }
                            } else {
                                return true
                            }
                        }
                    }

                }
            }

        }
    }

    guardarRecursoDB() {
        request
            .post('/responseLIGDS/agregarRecursoUno')
            .send({ tipo: this.state.tipo, link: this.state.link, descripcion: this.state.descripcion, idActividad: this.props.idActividad })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Se ha agregado el recurso")
                    this.props.fun.getRecursos()
                    this.setState({
                        tipo: '',
                        link: '',
                        descripcion: '',
                        pdf: null,
                        imagen: null,
                    })
                    this.handleClickOpen();
                }
            });
    }

    guardarTipoUno() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        this.guardarRecursoDB()
    }

    guardarTipoDos() {
        nuevoMensaje(tiposAlertas.cargando, "Guardando información")
        request
            .post('/responseLIGDS/uploadRecursoGuias/' + this.props.idActividad)
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
            .post('/responseLIGDS/uploadRecursoImagen/' + this.props.idActividad)
            .attach('image', this.state.imagen)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        link: respuestaLogin.imagen.filename
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

                <Box boxShadow={6} className="button buttonDos" onClick={() => this.handleClickOpen()}>Agregar recurso</Box>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><h2 className="tituloAgregarActividad">Nueva recurso</h2></DialogTitle>
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


export default (withStyles({


    formControl: {
        width: '100%',
        margin: "0em 0em 2em 0em",
        minWidth: 120,
    },

    formControlInput: {
    },



})(AgregarRecurso));