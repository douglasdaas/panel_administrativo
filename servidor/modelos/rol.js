const {mongoose} = require('../db/mongoose');

var Rol = mongoose.model('Rol',{
  Nombre: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  }
});

// var nuevoRol = new Rol({ //<---- rol de Prueba
//   Nombre: 'Rol de prueba'
// });
//
// nuevoRol.save().then((Rol) => {
//   console.log('Rol: ', JSON.stringify(Rol, undefined,2));//<---- como guardar un Rol
// }, (error) => {
//   console.log('No fue posible agregar el rol \n', error);
// });

module.exports = {Rol};
