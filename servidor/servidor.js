//NOTAS: PARA USAR LA BASE DE DATOS HAY QUE INICIARLA

console.log('Se inicio servidor.js');

const _ = require('lodash');
const express = require('express'); //Se utiliza la libreria express para el manejo de conexiones mas informacion en expressjs.com
const bodyParser = require('body-Parser');//bodyParser convierte JSON en objetos
var {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose');
var {Reporte} = require('./modelos/reporte');
var {Usuario} = require('./modelos/usuario');
var {Empresa} = require('./modelos/empresa');


var app = express();// Se inicia express en la variable app

app.use(bodyParser.json());
// USUARIO

//agregar usuario
app.post('/usuarios', (req, res) =>{ //<--- la ruta /usuarios es para crear una nuevo usuario
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

});

// obtener todos los usuarios
app.get('/usuarios', (req, res) =>{
  Usuario.find().then((usuarios) => {
    res.send({usuarios});
  }, (error) =>{
    res.status(400).send(error);
  });
});

// obtener usuario por id
app.get('/usuarios/:id',(req,res) =>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Usuario.findById(id).then((usuario) => {
    if (!usuario){
      return res.status(404).send('No se encontro');
    }
    res.send(JSON.stringify(usuario, undefined, 2));
  }).catch((e) => {
    res.status(400).send('Ocurrio un error');
  });
});

//actualizar usuario por id
app.patch('/usuarios/:id', (req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['Nombre', 'Apellido', 'Cedula', 'email']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Usuario.findByIdAndUpdate(id, {$set: body}, {new: true}).then((usuario) => {
    if (!usuario) {
      res.status(404).send('No se encontro');
    }
    res.send(usuario);
  }).catch((e) => {
    res.status(400).send();
  });
});

// eliminar usuario
app.delete('/usuarios/:id', (req, res) =>{ //<----- la eliminacion requiere el id del usuario a eliminar
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Usuario.findByIdAndRemove(id).then((usuario) => {
    if (!usuario){
      return res.status(404).send('No se encontro el reporte');
    }
    res.status(200).send(JSON.stringify(usuario, undefined, 2));
  }).catch((e) => {
    res.status(400).send('Ocurrio un error');
  });
});

// EMPRESA

//agregar empresas
app.post('/empresas', (req, res) =>{ //<--- la ruta /empresas es para crear una nueva empresa
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

// obtener todos las empresas
app.get('/empresas', (req, res) =>{
  Empresa.find().then((empresas) => {
    res.send({empresas});
  }, (error) =>{
    res.status(400).send(error);
  });
});

// obtener empresas por id
app.get('/empresas/:id',(req,res) =>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Empresa.findById(id).then((empresa) => {
    if (!empresa){
      return res.status(404).send('No se encontro');
    }
    res.send(JSON.stringify(empresa, undefined, 2));
  }).catch((e) => {
    res.status(400).send('Ocurrio un error');
  });
});

//actualizar empresa por id
app.patch('/empresas/:id', (req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['Nombre', 'RIF']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Empresa.findByIdAndUpdate(id, {$set: body}, {new: true}).then((empresa) => {
    if (!empresa) {
      res.status(404).send('No se encontro');
    }
    res.send(empresa);
  }).catch((e) => {
    res.status(400).send();
  });
});

// eliminar empresa
app.delete('/empresas/:id', (req, res) =>{ //<----- la eliminacion requiere el id de la empresa a eliminar
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Empresa.findByIdAndRemove(id).then((empresa) => {
    if (!empresa){
      return res.status(404).send('No se encontro el reporte');
    }
    res.status(200).send(JSON.stringify(empresa, undefined, 2));
  }).catch((e) => {
    res.status(400).send('Ocurrio un error');
  });
});

// REPORTE

//agregar reportes
app.post('/reportes', (req, res) =>{ //<--- la ruta /reportes es para crear un nuevo reporte
  var reporte = new Reporte({
    Nombre: req.body.Nombre,
    Descripcion: req.body.Descripcion,
    Monto: req.body.Monto,
    Moneda: req.body.Moneda,
    Tipo: req.body.Tipo
  });

  reporte.save().then( (reporte) => { //<----- guarda un nuevp reporte
    res.send(reporte);
  }, (error) => {
    res.status(400).send(error);// <--- envia el error del guardado
  });
});

//obtener todos los reportes
app.get('/reportes', (req, res) =>{
  Reporte.find().then((reportes) => {
    res.send({reportes});
  }, (error) =>{
    res.status(400).send(error);
  })
});

// obtener repoerte por id
app.get('/reportes/:id',(req,res) =>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Reporte.findById(id).then((reporte) => {
    if (!reporte){
      return res.status(404).send('No se encontro');
    }
    res.send(JSON.stringify(reporte, undefined, 2));
  }).catch((e) => {
    res.status(400).send('Ocurrio un error');
  });
});

//actualizar reporte por id
app.patch('/reportes/:id', (req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['Nombre', 'Descripcion', 'Monto', 'Moneda', 'Tipo']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Reporte.findByIdAndUpdate(id, {$set: body}, {new: true}).then((reporte) => {
    if (!reporte) {
      res.status(404).send('No se encontro');
    }
    res.send(JSON.stringify(reporte, undefined, 2));
  }).catch((e) => {
    res.status(400).send();
  });
});

// eliminar reporte
app.delete('/reportes/:id', (req, res) =>{ //<----- la eliminacion requiere el id del reporte a eliminar
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Reporte.findByIdAndRemove(id).then((reporte) => {
    if (!reporte){
      return res.status(404).send('No se encontro el reporte');
    }
    res.status(200).send(JSON.stringify(reporte, undefined, 2));
  }).catch((e) => {
    res.status(400).send('Ocurrio un error');
  });
});

//Acceso a la pagina principal

app.get('/', (req, res) =>{
  res.send('<h1>Panel administrativo<h1/>');// al recibir un request (conexion) se envia como respueta "Panel administrativo"
  console.log('Se envio respuesta');
});

app.listen(3000, () =>{ //<----- puerto escuchado las request
    console.log('Se esta escuchando en el puerto: 3000');
});
