import React, { Component } from 'react'
import "./AgregarInformativo.scss"
import { FormControl, InputLabel, Select, MenuItem, Input, TextField, Checkbox, FormControlLabel, Box, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import request from 'superagent';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'; import DateFnsUtils from '@date-io/date-fns';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import moment from "moment";
import AddIcon from '@material-ui/icons/Add';
import { resolve } from 'path';
import YouTube from 'react-youtube';


class EditarInformativo extends Component {

    constructor(props) {
        super(props)
        const infor = this.props.informativo

        this.state = {
            tiposInformativos: [],
            id: infor.id,
            tipo: infor.tipo,
            titulo: infor.titulo,
            descripcion: infor.descripcion,
            fechaPublicacion: infor.fechaPublicacion,
            fechaFin: infor.fechaFin,
            link: infor.link,
            modificoMultimedia: 0,
            tipoOriginal: infor.tipo,
            linkOriginal: infor.link,
            image: null,
            linkActivo: infor.linkActivo,
            linkExterno: infor.linkExterno,
            activo: infor.activo,
            open: false,
            grado: infor.grado,
            listaGrados: []

        }
    }



    handleClickOpen = () => {
        const infor = this.props.informativo
        this.props.fun.handleClickClose()
        this.setState({
            tipo: infor.tipo,
            id: infor.id,
            titulo: infor.titulo,
            descripcion: infor.descripcion,
            fechaPublicacion: infor.fechaPublicacion,
            fechaFin: infor.fechaFin,
            link: infor.link,
            image: null,
            linkActivo: infor.linkActivo,
            linkExterno: infor.linkExterno,
            activo: infor.activo,
            open: true,
            grado: infor.grado,

            modificoMultimedia: 0,
            tipoOriginal: infor.tipo,
            linkOriginal: infor.link,
        })
    };


    handleClickClose = () => {
        this.setState({
            tipo: 0,
            titulo: "",
            descripcion: "",
            fechaPublicacion: new Date(),
            fechaFin: new Date(),
            link: "",
            image: null,
            linkActivo: false,
            grado: 0,
            linkExterno: "",
            activo: true,
            open: false,
        })
    };



    componentDidMount() {
        this.getTiposInformativos()
        this.getGrados()
    }


    getTiposInformativos() {
        request
            .get('/responseLIGDS/tiposInformativos')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        tiposInformativos: respuestaLogin,
                    })
                }
            });
    }

    getGrados() {
        request
            .get('/responseLIGDS/grados')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listaGrados: respuestaLogin,
                    })
                }
            });
    }




    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    handleDateChangeInicio = (date) => {
        this.setState({
            fechaPublicacion: date
        })
    };

    handleDateChangeFin = (date) => {
        this.setState({
            fechaFin: date
        })
    };

    handleInputChange = (event) => {
        this.setState({
            linkActivo: !this.state.linkActivo
        })
    }

    handleInputChangeActivo = (event) => {
        this.setState({
            activo: !this.state.activo
        })
    }



    onSelectFileImage = (e) => {

        if (e.target.files[0]) {
            var file = e.target.files[0]
            if (file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png") {
                this.setState({
                    image: file
                })
            } else {
                nuevoMensaje(tiposAlertas.error, "Solo se permite cargar imagenes - .jpg .png .jpeg -")
            }
        }

    }

    validarInfo() {

        return new Promise((resolve, reject) => {
            if (this.state.titulo == '') {
                reject("Debes agregar un título para este recurso")
            } else {
                if (!this.isValidDate(moment(this.state.fechaPublicacion).format("MM/DD/YYYY"))) {
                    reject("Debes agregar una fecha de publicacion valida para este recurso")
                } else {
                    if (!this.isValidDate(moment(this.state.fechaFin).format("MM/DD/YYYY"))) {
                        reject("Debes agregar una fecha de finalización valida para este recurso")
                    } else {
                        if (this.state.linkActivo == true && this.state.linkExterno == "") {
                            reject("Debes agregar un link externo")
                        } else {
                            if (this.state.descripcion == '') {
                                reject("Debes agregar una descripción para este recurso")
                            } else {
                                if (this.state.modificoMultimedia == 1) {
                                    if (this.state.tipo == 0) {
                                        reject("Debes escoger un tipo de informativo")
                                    } else {
                                        if (this.state.tipo == 2 && this.state.image == null) {
                                            reject("Debes agregar una imagen")
                                        } else {
                                            if (this.state.tipo == 1 && this.state.link == '') {
                                                reject("Debes agregar un link")
                                            } else {
                                                if (this.state.tipo == 1) {
                                                    var video_id = this.state.link.split('.be/')[1];

                                                    if (!video_id) {

                                                        video_id = this.state.link.split('v=')[1];

                                                        if (!video_id) {
                                                            reject("El tipo de link no es valido, solo se permiten links de youtube")
                                                        } else {
                                                            resolve()
                                                        }
                                                    }
                                                } else {
                                                    resolve()
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    resolve()
                                }
                            }

                        }
                    }

                }
            }
        })


    }

    guardarRecursoDB() {
        var video_id = this.state.link
        if (this.state.modificoMultimedia == 1 && this.state.tipo == 1) {

            try {

                video_id = this.state.link.split('.be/')[1];

                if (video_id) {
                    var ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                    }
                } else {
                    video_id = this.state.link.split('v=')[1];
                    var ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                    }
                }
            } catch (error) {

            }

        }


        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/editarInformativo')
                .send({ id: this.state.id, tipo: this.state.tipo, titulo: this.state.titulo, descripcion: this.state.descripcion, link: video_id, linkActivo: this.state.linkActivo, linkExterno: this.state.linkExterno, fechaPublicacion: this.state.fechaPublicacion, fechaFin: this.state.fechaFin, grado: this.state.grado, activo: this.state.activo })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al guardar información")

                    } else {
                        resolve()
                    }
                });

        })
    }

    guardaimagen() {
        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/uploadInformativoImagen')
                .attach('image', this.state.image)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al guardar información")
                    } else {
                        const respuestaLogin = JSON.parse(res.text);
                        this.setState({
                            link: respuestaLogin.imagen.filename
                        }, resolve())



                    }
                });
        })
    }

    eliminaImagen() {
        return new Promise((resolve, reject) => {
            request
                .post('/responseLIGDS/deleteInformativoImagen')
                .send({ linkImage: this.state.linkOriginal })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al guardar información")
                    } else {
                        resolve(res)
                    }
                });
        })
    }


    guardar() {

        return new Promise((resolve, reject) => {

            if (this.state.modificoMultimedia == 0 || (this.state.modificoMultimedia == 1 && this.state.tipoOriginal == 1 && this.state.tipo == 1)) {

                this.guardarRecursoDB().then(() => {
                    resolve()
                }).catch((error) => {
                    reject(error)
                })

            } else {

                if (this.state.tipoOriginal == 1) {

                    this.guardaimagen().then(() => {

                        this.guardarRecursoDB().then(() => {
                            resolve()
                        }).catch((error) => {
                            reject(error)
                        })

                    }).catch((error) => {
                        reject(error)
                    })

                } else {

                    if (this.state.tipo == 2) {
                        this.eliminaImagen().then(() => {

                            this.guardaimagen().then(() => {

                                this.guardarRecursoDB().then(() => {
                                    resolve()
                                }).catch((error) => {
                                    reject(error)
                                })

                            }).catch((error) => {
                                reject(error)
                            })

                        }).catch((error) => {
                            reject(error)
                        })
                    } else {

                        this.eliminaImagen().then(() => {

                            this.guardarRecursoDB().then(() => {
                                resolve()
                            }).catch((error) => {
                                reject(error)
                            })

                        }).catch((error) => {
                            reject(error)
                        })

                    }



                }
            }

        })



    }

    isValidDate(dateString) {

        // First check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
            return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    }



    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Creando Informativo")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                this.props.fun2.getInformativos()
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }



    renderDato2() {

        switch (this.state.tipo) {
            case 1:
                return <Input className="inputform" type="text" placeholder="Link" value={this.state.link} name="link" onChange={this.onChange} />

            case 2:
                return (
                    <FormControl className={this.props.classes.formControl}>
                        <Input className="inputform" type="file" accept="image/*" className="buttonSelectImage" onChange={this.onSelectFileImage} />
                    </FormControl>
                )

            default:
                return <span>Escoge un tipo de informativo primero</span>
        }
    }

    renderMultimedia(item) {

        switch (item.tipo) {
            case 1:
                const opts = {

                    playerVars: {
                        // https://developers.google.com/youtube/player_parameters
                        autoplay: 0,
                    },
                };



                return (
                    <YouTube videoId={item.link} opts={opts} className="mediaRecurso Youtube" onReady={this._onReady} />
                )

                break;



            case 2:
                return (
                    <img className="mediaRecurso imagenInfor" src={"./recursosInformativos/" + item.link} alt="" />
                )
                break;


            default:
                return ("Imposible leer recurso")
                break;
        }
    }

    render() {
        return (

            <React.Fragment>
                <MenuItem onClick={() => this.handleClickOpen()}>Editar informativo</MenuItem>



                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Nuevo Informativo</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <TextField className="inputform" label="Título" type="text" value={this.state.titulo} name="titulo" onChange={this.onChange} />
                                <TextField className="inputform" label="Descripción" multiline rowsMax={8} value={this.state.descripcion} name="descripcion" onChange={this.onChange} />

                                <FormControl className={this.props.classes.formControl}>
                                    <InputLabel className={this.props.classes.formControlInput} htmlFor="max-width">Publico objetivo</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.grado} inputProps={{ name: 'grado', id: 'grado' }} >
                                        <MenuItem value={-1}>Todos</MenuItem>
                                        {this.state.listaGrados.map((grado) => <MenuItem value={grado.id}>{grado.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                {this.state.modificoMultimedia == 1 ?
                                    [
                                        <FormControl className={this.props.classes.formControl}>
                                            <InputLabel className={this.props.classes.formControlInput} htmlFor="max-width">Tipo de informativo</InputLabel>
                                            <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.tipo} inputProps={{ name: 'tipo', id: 'tipo' }} >
                                                <MenuItem value={0}>Seleccione tipo de informativo a crear</MenuItem>
                                                {this.state.tiposInformativos.map((tipo) => <MenuItem value={tipo.id}>{tipo.nombre}</MenuItem>)}
                                            </Select>
                                        </FormControl>,

                                        this.renderDato2()
                                    ]
                                    :
                                    [
                                        this.renderMultimedia(this.props.informativo),
                                        <div className="button buttonUno buttonDelgado" onClick={() => this.setState({ link: "", modificoMultimedia: 1, tipo: 0 })}>Cambiar multimedia</div>
                                    ]
                                }





                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Fecha inicial de publicación"
                                        className="inputform"
                                        value={this.state.fechaPublicacion}
                                        onChange={this.handleDateChangeInicio}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />

                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Fecha final de publicación"
                                        className="inputform"
                                        value={this.state.fechaFin}
                                        onChange={this.handleDateChangeFin}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>


                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.linkActivo} onChange={this.handleInputChange} value="checkedB" color="primary" />
                                    }
                                    label="Link externo"
                                />

                                {this.state.linkActivo == true ?
                                    <Input className="inputform" type="text" placeholder="Link Externo" value={this.state.linkExterno} name="linkExterno" onChange={this.onChange} />
                                    :
                                    null
                                }


                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.activo} onChange={this.handleInputChangeActivo} value="activo" color="primary" />
                                    }
                                    label="Activo"
                                />


                            </form>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.onSubmit()}>
                            Guardar
                    </Button>

                        <Button color="primary" onClick={this.handleClickClose}>
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
        margin: "0em 0em 1em 0em",
        minWidth: 120,
    },

    formControlInput: {
    },

})(EditarInformativo))