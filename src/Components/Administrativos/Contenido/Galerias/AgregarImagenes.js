import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, TextField } from '@material-ui/core';
import React, { Component } from 'react'
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import DoneIcon from '@material-ui/icons/Done';
import BackupIcon from '@material-ui/icons/Backup';
import './AgregarImagenes.scss'
import request from 'superagent';




var eliminar;
export default class AgregarImagenes extends Component {

    constructor(props) {
        super(props)

        this.state = {
            images: [],
            src: "",
            prueba: "",
            open: false
        }
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            images: [],
            src: "",
            open: false,
        })
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    onSelectFileImage = e => {

        if (e.target.files && e.target.files.length > 0) {

            var imagenes = []

            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];


                const reader = new FileReader();
                reader.addEventListener('load', () =>
                    this.setState({
                        images: [...this.state.images, { src: reader.result, cargando: 0 }]
                    })
                );

                reader.readAsDataURL(e.target.files[i]);


            }



        }
    };

    eliminarImagen(index) {
        const imagenes = this.state.images
        imagenes.splice(index, 1)
        this.setState({
            images: imagenes
        })
    }

    moverImagen(indexA, indexB) {
        const imagenes = this.state.images

        var temp = imagenes[indexA]
        imagenes[indexA] = imagenes[indexB]
        imagenes[indexB] = temp

        this.setState({
            images: imagenes
        })
    }

    dataURLtoFile(dataurl, filename) {

        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
                
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, {type:mime});
        return croppedImage;
    }

    guardarLinkImagen(link, index){
    
        request
        .post('/responseLIGDS/creaImagenGaleria')
        .send({ idGaleria: this.props.galeria.id, link: link}) // sends a JSON post body
        .set('accept', 'json')
        .end((err, res) => {
                
            if (err) {
                const imagenes= this.state.images
                imagenes[index].cargando = 3
                this.setState({ images: imagenes})
            } else {
                
                const imagenes= this.state.images
                imagenes[index].cargando = 2
                this.setState({ images: imagenes})
                clearTimeout(eliminar)

                eliminar = setTimeout(() => {this.eliminarImagen(index); this.props.fun.getImagenes()}, 2000);

            }
    
    
        });
    
    }

    onSubmit = () => {

        this.state.images.map((imagen, index) => {
            const imagenes= this.state.images
            imagenes[index].cargando = 1
            this.setState({ images: imagenes})
            request
                .post('/responseLIGDS/uploadImagenGaleria/' + this.props.galeria.id)
                .attach('image', this.dataURLtoFile(imagen.src, "imagen"+index+".jpg"))
                .set('accept', 'json')
                .end((err, res) => {

                    if (err) {
                        const imagenes= this.state.images
                        imagenes[index].cargando = 3
                        this.setState({ images: imagenes})
                    } else {



                        const respuestaLogin = JSON.parse(res.text);
                            this.guardarLinkImagen(respuestaLogin.imagen.filename, index)



                    }


                });
        })
    }

    renderImagenesPreview() {

        return (
            this.state.images.map((imagen, index) =>
                <div className="imagenPreview">
                    <div className="estadoCarga">
                        {this.renderEstadoCarga(imagen.cargando)}
                    </div>

                    <img loading="lazy" alt="Crop " className="cropImage" style={{ maxWidth: '100%' }} src={imagen.src} />
                    <div className="botones">
                        {index > 0 && (<ArrowLeftIcon className="flecha" onClick={() => { this.moverImagen(index, index - 1) }} />)}
                        <HighlightOffIcon className="eliminar" onClick={() => { this.eliminarImagen(index) }} />
                        {index < this.state.images.length - 1 && (<ArrowRightIcon className="flecha" onClick={() => { this.moverImagen(index, index + 1) }} />)}
                    </div>
                </div>
            )
        )
    }

    renderEstadoCarga(estado){

        switch (estado) {
            case 1:
                return <div className="cargando"><BackupIcon/></div>
                break;

            case 2:
                return <div className="cargaOk"> <DoneIcon/> </div>
            break;

            case 3:
                return <div className="cargaWrong"> <PriorityHighIcon/> </div>
            break;
        
            default:
                break;
        }
    }



    render() {
        return (
            <React.Fragment>

                <div className="boton" onClick={() => this.handleClickOpen()}>
                    Agregar imagenes
                </div>


                <Dialog
                    fullWidth={true}
                    maxWidth="md"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Agregar fotos a galería</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <Input className="inputform" type="file" accept="image/*" className="buttonSelectImage" onChange={this.onSelectFileImage} inputProps={{ multiple: true }} />

                            </form>
                        </div>

                        {this.state.images.length > 0 && (
                            <div className="listaImagenesPreview">
                                {this.renderImagenesPreview()}
                            </div>
                        )
                        }

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
