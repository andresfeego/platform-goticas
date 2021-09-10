export const saveUsuarioAdmin = (usuarioAdmin)=>{
    return{
        type: 'SET_USUARIOADMIN',
        usuarioAdmin: usuarioAdmin
    }
}

export const clearUsuarioAdmin = ()=>{
    return{
        type: 'CLEAR_USUARIOADMIN'
    }
}

//_____________________________________ maestro______________________________________________

export const saveMaestro = (maestroAdmin)=>{
    return{
        type: 'SET_MAESTROADMIN',
        maestroAdmin: maestroAdmin
    }
}

export const clearMaestro = ()=>{
    return{
        type: 'CLEAR_MAESTROADMIN'
    }
}

//_____________________________________ alumno ______________________________________________

export const saveAlumno = (alumnoAdmin)=>{
    return{
        type: 'SET_ALUMNOADMIN',
        alumnoAdmin: alumnoAdmin
    }
}

export const clearAlumno = ()=>{
    return{
        type: 'CLEAR_ALUMNOADMIN'
    }
}
