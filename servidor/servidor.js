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
var {autentificar} = require('./midelware/autenticar');


var app = express();// Se inicia express en la variable app

app.use(bodyParser.json());
// USUARIO

//agregar usuario
app.post('/usuarios', (req, res) =>{ //<--- la ruta /usuarios es para crear una nuevo usuario
  var body = _.pick(req.body, ['nombre','apellido','cedula','email', 'password']); //<--- datos que me proprciona el usuario
  var usuario = new Usuario(body); //<---- creo el usuario

  usuario.save().then(() => {  //<----- guarda un nuevo usuario
    return usuario.generateAuthToken(); //<----- genera un token de autorizacion para el usuario
  }).then((token) => { //<----- promesa del token que me devolvio generateAuthToken()
    res.header('x-auth', token).send(usuario) //<----- devuelve el token(en un header) y el usuario
  }).catch((e) => { //<---- manejo los erroes
    res.status(400).send(e);
  });
});

//obtener usuario yo

app.get('/usuarios/yo', autentificar, (req,res) => {
  res.send(req.usuario);
});

// login de usuario

app.post('/usuarios/login', (req, res) =>{
  var body = _.pick(req.body, ['email', 'password']); //<----- toma el usuario y la contraseña para compararlos

  Usuario.findByCredenciales(body.email, body.password).then( (usuario) => { //<----- verifica que el usuario tiene el usuario y la clave correcta
    return usuario.generateAuthToken().then((token) => { //<----- genera un token de autorizacion para el usuario
      res.header('x-auth', token).send(usuario); //<----- devuelve el token(en un header) y el usuario
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// deslogiar usuario

app.delete('/usuarios/yo/token', autentificar, (req,res) =>{ //<------ autentificar me pasa el usuario y el token, y verifica que el usuario este logiado
  req.usuario.removeToken(req.token).then(() => { //<-------- elimina el token para deslogiar el usuario
    res.status(200).send();
  }, () =>{ //<-------- manejo de errores
    res.status(400).send();
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
  var body = _.pick(req.body, ['Nombre', 'RIF'])
  var empresa = new Empresa(body);

  empresa.save().then( (empresa) => { //<----- guarda una nueva empresa
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
app.post('/reportes', autentificar, (req, res) =>{ //<--- la ruta /reportes es para crear un nuevo reporte
  var reporte = new Reporte({
    Nombre: req.body.Nombre,
    Descripcion: req.body.Descripcion,
    Monto: req.body.Monto,
    Moneda: req.body.Moneda,
    Tipo: req.body.Tipo,
    _creador: req.usuario._id
  });

  reporte.save().then( (reporte) => { //<----- guarda un nuevp reporte
    res.send(reporte);
  }, (error) => {
    res.status(400).send(error);// <--- envia el error del guardado
  });
});

//obtener todos los reportes
app.get('/reportes', autentificar, (req, res) =>{
  Reporte.find({
    _creador: req.usuario._id
  }).then((reportes) => {
    res.send({reportes});
  }, (error) =>{
    res.status(400).send(error);
  })
});

// obtener repoerte por id
app.get('/reportes/:id', autentificar, (req,res) =>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Reporte.findOne({
    _id: id,
    _creador: req.usuario._id
  }).then((reporte) => {
    if (!reporte){
      return res.status(404).send('No se encontro');
    }
    res.send(JSON.stringify(reporte, undefined, 2));
  }).catch((e) => {
    res.status(400).send('Ocurrio un error');
  });
});

//obtener reportes por atributos
app.post('/reportes/atributos', autentificar, (req, res) =>{
  Reporte.find({
    Nombre: req.body.Nombre,
    Descripcion: req.body.Descripcion,
    Monto: req.body.Monto,
    Moneda: req.body.Moneda,
    Tipo: req.body.Tipo,
    _creador: req.usuario._id
    }
  ).then((reportes) => {
    res.send({reportes});
  }, (error) =>{
    res.status(400).send(error);
  })
});

//actualizar reporte por id
app.patch('/reportes/:id', autentificar, (req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['Nombre', 'Descripcion', 'Monto', 'Moneda', 'Tipo']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Reporte.findOneAndUpdate({_id: id, _creador: req.usuario._id}, {$set: body}, {new: true}).then((reporte) => {
    if (!reporte) {
      res.status(404).send('No se encontro');
    }
    res.send(JSON.stringify(reporte, undefined, 2));
  }).catch((e) => {
    res.status(400).send();
  });
});

// eliminar reporte
app.delete('/reportes/:id', autentificar, (req, res) =>{ //<----- la eliminacion requiere el id del reporte a eliminar
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('El id es invalido');
  }
  Reporte.findOneAndRemove({
    _id: id,
    _creador: req.usuario.id
  }).then((reporte) => {
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
