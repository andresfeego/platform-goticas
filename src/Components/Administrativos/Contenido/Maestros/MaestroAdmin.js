import React, { Component } from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditarMaestro from './EditarMaestro';
import EditarGradosMaestro from './EditarGradosMaestro';
import EliminarMaestro from './EliminarMaestro';


export default class MaestroAdmin extends Component {

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


    render() {

        const maestro = this.props.maestro

        return (
            <div className="gradoAdmin">
                <span>{maestro.nombre + " " + maestro.apellido }</span>

                <div className="menuGrado" onClick={this.handleClickOpen}>
                    <MoreVertIcon />
                </div>

                <Menu id="simple-menu" anchorEl={this.state.setAnchorEl} keepMounted open={this.state.open} onClose={this.handleClickOpen}>
                    <EditarMaestro fun={this.props.fun} fun2={this} maestro={maestro}/>
                    <EditarGradosMaestro fun={this.props.fun} fun2={this} maestro={maestro}/>
                    <EliminarMaestro fun={this.props.fun} fun2={this} maestro={maestro}/>
                </Menu>

            </div>
        )
    }
}
