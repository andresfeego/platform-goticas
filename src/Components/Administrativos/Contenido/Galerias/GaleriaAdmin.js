import React, { Component } from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Menu, MenuItem } from '@material-ui/core';
import EditarGrado from '../Grados/EditarGrado';
import EditarGaleria from './EditarGaleria';
import EliminarImagenesAll from './EliminarImagenesAll';
import EliminarGaleria from './EliminarGaleria';

export default class GaleriaAdmin extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false,
            setAnchorEl: null
        }
    }

    handleClickOpen = (event) => {
        this.setState({
            open: !this.state.open,
            setAnchorEl: event.currentTarget
        })
    };

    handleClickClose = () => {
        this.setState({
            open: !this.state.open,
            setAnchorEl: null

        })
    };

    VerGaleria(galeria){
        this.props.fun2.cambiarGaleria(galeria)
        this.props.fun2.cambiarEstado(10)
    }


    render() {

        const index = this.props.index
        const finLista = this.props.finLista


        return (
            <div className="galeria" >
                <span className="nombre" onClick={() => this.VerGaleria(this.props.galeria)}>{this.props.galeria.nombre}</span>   
                

                <div className="menuGaleriaAdmin" onClick={this.handleClickOpen}>
                    <MoreVertIcon />
                </div>    

                <Menu id="simple-menu" anchorEl={this.state.setAnchorEl} keepMounted open={this.state.open} onClose={this.handleClickOpen}>
                        <MenuItem onClick={() => this.VerGaleria(this.props.galeria)}>Ver</MenuItem>
                        <EditarGaleria galeria={this.props.galeria} fun={this} fun2={this.props.fun}/>
                        <EliminarGaleria galeria={this.props.galeria} fun={this} fun2={this.props.fun}/>
                </Menu>


                <div className="mover">
                    {index > 0 ? <ArrowDropUpIcon onClick={() => this.props.fun.moverArriba(index)}/>: null}
                    {index < finLista-1 ? <ArrowDropDownIcon onClick={() => this.props.fun.moverAbajo(index)}/>: null}
                </div>
            </div>
        )
    }
}
