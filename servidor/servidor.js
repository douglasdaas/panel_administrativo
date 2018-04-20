//NOTAS: PARA USAR LA BASE DE DATOS HAY QUE INICIARLA

console.log('Se inicio servidor.js');

const express = require('express'); //Se utiliza la libreria express para el manejo de conexiones mas informacion en expressjs.com

var {mongoose} = require('./db/mongoose');
var {Reporte} = require('./modelos/reporte');
var {Usuario} = require('./modelos/usuario');


var app = express();// Se inicia express en la variable app

app.get('/', (req, res) =>{
  res.send('<h1>Panel administrativo<h1/>');// al recibir un request (conexion) se envia como respueta "Panel administrativo"
  console.log('Se envio respuesta');
});

app.listen(3000, () =>{ //<----- puerto escuchado las request
    console.log('Se esta escuchando en el puerto: 3000');
});
