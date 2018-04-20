const mongoose = require('mongoose');

var Usuario = mongoose.model('Usuario',{
  Nombre: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  }
});


// var nuevoUsuario = new Usuario({ <------ Usuario de prueba
//   Nombre: 'Douglas',
//   email: 'douglasdaas@gmail.com'
// });
//
// nuevoUsuario.save().then((usuario) => {
//   console.log('Usuario', JSON.stringify(usuario, undefined, 2)); <----- como guardar un Usuario
// }, (error) => {
//   console.log('No fue posible agregar el reporte', error);
// });

module.exports = {Usuario};
