const {mongoose} = require('../db/mongoose');

var Reporte = mongoose.model('Reporte',{
  Nombre: {
    type: String,
    required: true, //<----- si es requerido
    minlength: 1, //<----- logitud minima del String
    trimp: true //<----- Borra los espcios al comienzo y al final de los Strings
  },
  Descripcion: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  },
  Monto: {
    type: Number,
    required: true,
    minlength: 1,
    trimp: true
  },
  Moneda: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20, //<---- logitud maxima del String
    trimp: true
  },
  Tipo: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  },
  _creador: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }, 
   _visualizadores: [
    visualizar:{
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  ]}
});

// var nuevoReporte = new Reporte({
  // Nombre:'Prueba de Reporte 2',
  // Descripcion:'Esto es la segunda prueba de agregar un nuevo reporte',//<---- Reporte de prueba
  // Monto:'1000.50',
  // Modena:'Dolares',
  // Tipo:'Gasto'
// });
//
// nuevoReporte.save().then((reporte) => {
//   console.log(`Reporte: ${JSON.stringify(reporte, undefined, 2)}`);//<---- Como guardar un Reporte
// }, (error) =>{
//   console.log('No fue posible agregar el reporte');
// });



module.exports = {Reporte}; //<---- module.exports permite exportar funciones y variables de este archivo
