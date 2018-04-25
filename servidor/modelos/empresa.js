const {mongoose} = require('../db/mongoose');


var Empresa = mongoose.model('Empresa',{
  Nombre: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  },
  RIF: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 10,
    trimp: true
  }
});

// var nuevaEmpresa = new Empresa({//<----- Empresa de prueba
//   Nombre: 'Empresa de Prueba',
//   RIF: 'J075098846'
// });
//
// nuevaEmpresa.save().then((empresa) => {
//   console.log(`Reporte: ${JSON.stringify(empresa, undefined, 2)}`);//<---- Como guardar una Empresa
// }, (error) =>{
//   console.log('No fue posible agregar la empresa');
// });

module.exports = {Empresa};
