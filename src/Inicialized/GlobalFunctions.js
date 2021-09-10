export const MaysPrimera = (string) => {
    var salida = string.toLowerCase();
    return salida.charAt(0).toUpperCase() + salida.slice(1);
}



String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};