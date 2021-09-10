import React, { Component } from 'react'
import "./AgregarInformativo.scss"
import { FormControl, InputLabel, Select, MenuItem, Input, TextField, Checkbox, FormControlLabel, Box, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import request from 'superagent';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'; import DateFnsUtils from '@date-io/date-fns';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import moment from "moment";
import AddIcon from '@material-ui/icons/Add';

class AgregarInformativo extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tiposInformativos: [],
            tipo: 0,
            titulo: "",
            descripcion: "",
            fechaPublicacion: new Date(),
            fechaFin: new Date(),
            publico: 0,
            link: "",
            image: null,
            linkActivo: false,
            linkExterno: "",
            activo: true,
            open: false,
            grado: 0,
            listaGrados: []

        }
    }



    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            tipo: 0,
            titulo: "",
            descripcion: "",
            fechaPublicacion: new Date(),
            fechaFin: new Date(),
            publico: 0,
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
            if (this.state.tipo == 0) {
                reject("Debes escoger un tipo de recurso")
            } else {
                if (this.state.tipo == 2 && this.state.image == null) {
                    reject("no has cargado ninguna imagen - .jpg .png .jpeg -")
                } else {
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
                            }

                        }
                    }

                }
            }
        })


    }

    codificarLinkYoutube(){
        return new Promise((resolve, reject) =>{
            
            try {
            
                var video_id = this.state.link.split('.be/')[1];
        
                if (video_id) {
                    var ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                        resolve(video_id)
                    }else{
                        resolve(video_id)

                    }
                } else {
                    video_id = this.state.link.split('v=')[1];
                    var ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                        resolve(video_id)
                    }else{
                        resolve(video_id)

                    }
                }
            
            
            } catch (error) {
                reject(error)
            }
            
        })
    }
    
    guardarRecursoDB(link) {
        
        return new Promise((resolve, reject) => {
        

                request
                    .post('/responseLIGDS/crearInformativo')
                    .send({ tipo: this.state.tipo, titulo: this.state.titulo, descripcion: this.state.descripcion, link: link, linkActivo: this.state.linkActivo, linkExterno: this.state.linkExterno, fechaPublicacion: this.state.fechaPublicacion, fechaFin: this.state.fechaFin, grado: this.state.grado, activo: this.state.activo })
                    .set('accept', 'json')
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                            reject( "Error al guardar información")
        
                        } else {
                            resolve()
                        }
                    });
    
            
            
        })



    }

    
    guardar() {

        return new Promise ((resolve, reject) => {

            if ( this.state.tipo == 1 ) {
                this.codificarLinkYoutube().then((link) => {

                    this.guardarRecursoDB(link).then(() =>{
                        resolve()
                    }).catch ((error) =>{
                        reject(error)
                    })
                
            }).catch((error) => {
                reject("Error al codificar link de youtube " + error)
            })
    
            } else {
                
                request
                    .post('/responseLIGDS/uploadInformativoImagen')
                    .attach('image', this.state.image)
                    .set('accept', 'json')
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                            reject ("Error al guardar información")
                        } else {
                            const respuestaLogin = JSON.parse(res.text);
                            this.setState({
                                link: respuestaLogin.imagen.filename
                            })

                            this.guardarRecursoDB(respuestaLogin.imagen.filename).then(() =>{
                                resolve()
                            }).catch ((error) =>{
                                reject(error)
                            })

                        }
                    });
                
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
                this.props.fun.getInformativos()
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

    render() {
        return (

            <React.Fragment>
                <Box className="gradoAdmin nuevoGrado" onClick={() => this.handleClickOpen()}>
                    <AddIcon />
                    <span>Nuevo Informativo</span>
                </Box>


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

                                <FormControl className={this.props.classes.formControl}>
                                    <InputLabel className={this.props.classes.formControlInput} htmlFor="max-width">Tipo de informativo</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.tipo} inputProps={{ name: 'tipo', id: 'tipo' }} >
                                        <MenuItem value={0}>Seleccione tipo de informativo a crear</MenuItem>
                                        {this.state.tiposInformativos.map((tipo) => <MenuItem value={tipo.id}>{tipo.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                {this.renderDato2()}

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

})(AgregarInformativo))