import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import localStore from './Inicialized/localStore'
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';


ReactDOM.render(
  <Provider store={localStore}>
    <App />
    <ToastContainer 
      position="top-left"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      transition={Flip}
      rtl={false}
      pauseOnVisibilityChange
      draggable
      pauseOnHover/>
      
  </Provider>,

  document.getElementById('root')
);

serviceWorker.unregister();
