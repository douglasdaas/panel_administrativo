//NOTAS: PARA USAR LA BASE DE DATOS HAY QUE INICIARLA

console.log('Se inicio servidor.js');

const express = require('express'); //Se utiliza la libreria express para el manejo de conexiones mas informacion en expressjs.com
const bodyParser = require('body-Parser');//bodyParser convierte JSON en objetos

var {mongoose} = require('./db/mongoose');
var {Reporte} = require('./modelos/reporte');
var {Usuario} = require('./modelos/usuario');
var {Empresa} = require('./modelos/empresa');


var app = express();// Se inicia express en la variable app

app.use(bodyParser.json());

app.post('/usuarios', (req, res) =>{ //<--- la ruta /reporte es para crear una nuevo usuario
  var reporte = new Usuario({
    Nombre: req.body.Nombre,
    Apellido: req.body.Apellido,
    Cedula: req.body.Cedula,
    email: req.body.email

  });

  reporte.save().then( (usuario) => { //<----- guarda un nuevo usuario
    res.send(usuario);
  }, (error) => {
    res.status(400).send(error);// envia el error del guardado
  });

  app.post('/empresas', (req, res) =>{ //<--- la ruta /reporte es para crear una nueva empresa
    var reporte = new Empresa({
      Nombre: req.body.Nombre,
      RIF: req.body.RIF
    });

    reporte.save().then( (empresa) => { //<----- guarda una nueva empresa
      res.send(empresa);
    }, (error) => {
      res.status(400).send(error);// envia el error del guardado
    });

    


});

app.get('/', (req, res) =>{
  res.send('<h1>Panel administrativo<h1/>');// al recibir un request (conexion) se envia como respueta "Panel administrativo"
  console.log('Se envio respuesta');
});

app.listen(3000, () =>{ //<----- puerto escuchado las request
    console.log('Se esta escuchando en el puerto: 3000');
});
