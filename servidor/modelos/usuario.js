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
    acces:{ //<---- guarda el tipo de acceso
      type: String,
      required: true
    },
    token:{ //<---- guarda el valor del token
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
  var acces = 'auth'; //<----- tipo de token
  var token = jwt.sign({_id: usuario._id.toHexString(), acces}, '090998').toString(); // <----- genera el token de tipo JWT

  usuario.tokens.push({acces, token}); //<----- introduce el token en el array de tokens

  return usuario.save().then(() => { //devuelve los datos guardados porque nos intersa usar token en servidor.js
    return token ; //<--- devuele el token
  });
};

UsuarioSchema.statics.findByToken = function (token) {
  var Usuario = this; //<------ para tomar todos los UsuarioSchema
  var decodificado; //<---- guarda los datos decodificados del token

  try {
  decodificado = jwt.verify(token, '090998'); //<---- asigna el valor si no ocurre un error
  } catch (e) {
    return Promise.reject(); //<----- maneja el error rechazando la promesa
  }

  return Usuario.findOne({ //<----- caso positivo, devuelve datos del usuario encontrado
    '_id': decodificado._id, //<------ el id del usuario encontrado
    'tokens.token': token, //<----- el token del usuario encontrado
    'tokens.acces': 'auth' //<----- el tipo de acceso del usuario encontrado
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
