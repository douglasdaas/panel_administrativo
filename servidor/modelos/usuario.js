const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UsuarioSchema = new mongoose.Schema({ //<--- se usa UsuarioSchema para poder agregar metodos a todos los Usuarios
  nombre: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  },
  apellido: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true
  },
  cedula:{
    type: Number,
    required: true,
    minlength: 1,
    trimp: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trimp: true,
    unique: true,
    validate:{
      validator: validator.isEmail,
      message: '{valor} no es un email valido!'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    acces:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});

UsuarioSchema.methods.toJSON = function () { //Correcion de la funcion toJSON para que solo devuelva datos que quiero por seguridad
  var usuario = this; //<---- para tomar un usuario particuar
  var usuarioObjeto = usuario.toObject(); //<----- convierto el usuario en un objeto

  return _.pick(usuarioObjeto, ['_id','email', 'nombre', 'apellido','cedula']); //<---- escojo los datos que quiero devolver
};

UsuarioSchema.methods.generateAuthToken = function () { //<----- funcion que genera el token
  var usuario = this; //<---- para tomar un usuario particuar
  var acces = 'autorizacion'; //<----- tipo de token
  var token = jwt.sign({_id: usuario._id.toHexString(), acces}, '090998').toString(); // <----- genera el token de tipo JWT

  usuario.tokens.push({acces, token}); //<----- introduce el token en el array de tokens

  return usuario.save().then(() => { //devuelve los datos guardados porque nos intersa usar token en servidor.js
    return token ; //<--- devuele el token
  });
};

var Usuario = mongoose.model('Usuario', UsuarioSchema); //<---- Dejo el modelo igual que antes, le paso los datos de UsuarioSchema


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
