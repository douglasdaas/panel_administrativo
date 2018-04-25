//NOTAS: PARA USAR LA BASE DE DATOS HAY QUE INICIARLA

console.log('Se inicio servidor.js');

const express = require('express'); //Se utiliza la libreria express para el manejo de conexiones mas informacion en expressjs.com
const bodyParser = require('body-Parser');//bodyParser convierte JSON en objetos

var {mongoose} = require('./db/mongoose');
var {Reporte} = require('./modelos/reporte');
var {Usuario} = require('./modelos/usuario');


var app = express();// Se inicia express en la variable app

app.use(bodyParser.json());

app.post('/reportes', (req, res) =>{ //<--- la ruta /reporte es para crear un nuevo reporte
  var reporte = new Reporte({
    Nombre: req.body.Nombre,
    Descripcion: req.body.Descripcion,
    Monto: req.body.Monto,
    Moneda: req.body.Moneda,
    Tipo: req.body.Tipo
  });

  reporte.save().then( (reporte) => { //<----- guarda un nuevp reporte
    res.send(reporte);
  }, (erre) => {
    res.status(400).send(error);// envia el error del guardado
  })

});

app.get('/', (req, res) =>{
  res.send('<h1>Panel administrativo<h1/>');// al recibir un request (conexion) se envia como respueta "Panel administrativo"
  console.log('Se envio respuesta');
});

app.listen(3000, () =>{ //<----- puerto escuchado las request
    console.log('Se esta escuchando en el puerto: 3000');
});
