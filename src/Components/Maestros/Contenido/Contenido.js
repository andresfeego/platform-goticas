import React, { Component } from 'react'
import "./Contenido.scss"
import ContenidoGrado from './Grado/ContenidoGrado'
import { connect } from 'react-redux';
import { saveMaestro } from '../../../Inicialized/Actions';
import request from 'superagent';



class Contenido extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listagrados: [],
            grado: 0,
        };
    };

    componentDidMount() {
        this.getGrados(this.props.idUsuario)
    }

    componentWillReceiveProps(nextProps) {
        this.getGrados(nextProps.idUsuario)
    }


    getGrados(id) {
        console.log(id)
        if (id != null) {
            request
                .get('/responseLIGDS/gradosXprofesor/' + id)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);

                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        this.setState({
                            listagrados: respuestaLogin,
                            grado: respuestaLogin[0],
                        })
                    }
                });
        }
    }


    cambiarGrado(item) {
        this.setState({
            grado: item,
        })
    }

    render() {
        return (
            <div className="ContenidoMaestros">

                <div className="Botonera">

                    {this.state.listagrados.length != 0 ?
                        this.state.listagrados.map((item) => <div key={item.id} className="button buttonUno buttonDelgado buttonMargin1" onClick={() => this.cambiarGrado(item)}>{item.nombre}</div>)
                        :
                        null
                    }
                </div>

                <ContenidoGrado grado={this.state.grado} />

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        maestroAdmin: state.maestroAdmin
    }
}

const mapDispatchToProps = {
    saveMaestro

}

export default connect(mapStateToProps, mapDispatchToProps)(Contenido);