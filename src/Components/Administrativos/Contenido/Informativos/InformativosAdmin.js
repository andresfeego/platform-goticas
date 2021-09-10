import React, { Component } from 'react'
import "./InformativosAdmin.scss"
import AddIcon from '@material-ui/icons/Add';
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';
import InforAdmin from './InforAdmin';
import AgregarInformativo from './AgregarInformativo';

export default class InformativosAdmin extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             listaInfor: []
        }
    }

    
    componentDidMount(){
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getInformativos()
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarEstado(1)
        }
      }
    
    getInformativos(){
        request
        .get('/responseLIGDS/informativos')
        .set('accept', 'json')
        .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    
                const respuestaLogin =   JSON.parse(res.text);
                this.setState({
                    listaInfor: respuestaLogin,
                })
                }
        });
    }

    renderListaInfor(){
        if (this.state.listaInfor.length == 0) {
            return (
                <div className="listaInformativos">
                    <span>Sin informativos</span>
                </div>

            )
        } else {
            return(
                <div className="listaInformativos">
                    {this.state.listaInfor.map((infor) => 
                        <InforAdmin informativo={infor} fun={this}/>
    
                    )}
                </div>
            )
            
        }
    }

    render() {
        return (
            <div className="adminInfor">
                <AgregarInformativo fun={this} />

                { this.state.listaInfor == "init" ? 
                        <Cargando/>
                    :
                        this.renderListaInfor()
                }
            </div>
        )
    }
}
