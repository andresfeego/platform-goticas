import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Maestros from './Components/Maestros/Maestros'
import Alumnos from './Components/Alumnos/Alumnos'
import Administrativos from './Components/Administrativos/Administrativos'
import Prueba from './Prueba'

function App() {

  
  return (
    <BrowserRouter>
      <Route path="/maestros" component={Maestros}/>
      <Route path="/alumnos" component={Alumnos}/>
      <Route path="/administrativos" component={Administrativos}/>
      <Route path="/" component={Prueba}/>

           
      </BrowserRouter>
  );
}

export default App;
