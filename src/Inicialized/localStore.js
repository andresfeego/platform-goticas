import {createStore, combineReducers} from 'redux'

const auxiusuario = {"id":104953524,"correo":"leidypinedaa@gmail.com ","nombre":"Leidy Yidith ","apellido":"Pineda Arias","pass":"123"}

function usuarioAdminReducer(state=[],action){
    switch (action.type) {
        case 'SET_USUARIOADMIN':  
            return action.usuarioAdmin;
        
        case 'CLEAR_USUARIOADMIN': 
            return [];
    

        default:
            return state;
    }
}

function maestroReducer(state=[],action){
    switch (action.type) {
        case 'SET_MAESTROADMIN':  
            return action.maestroAdmin;
        
        case 'CLEAR_MAESTROADMIN': 
            return [];
    

        default:
            return state;
    }
}

function alumnoReducer(state=[],action){
    switch (action.type) {
        case 'SET_ALUMNOADMIN':  
            return action.alumnoAdmin;
        
        case 'CLEAR_ALUMNOADMIN': 
            return [];
    

        default:
            return state;
    }
}


let rootReducer = combineReducers({
    usuarioAdmin: usuarioAdminReducer,
    maestroAdmin: maestroReducer,
    alumnoAdmin:  alumnoReducer,
});

export default createStore(rootReducer);