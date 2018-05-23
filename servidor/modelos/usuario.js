const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UsuarioSchema.methods.removeToken = function (token) {
  usuario = this;

  return usuario.update({
    $pull: {
      tokens:{
        token: token
      }
    }
  });
};

UsuarioSchema.statics.findByCredenciales = function (email, password) {
  var Usuario = this;

  return Usuario.findOne({email}).then((usuario) => {
    if (!usuario){ //<------- verifica si el usuario existe
      return Promise.reject();
    }

  return new Promise((resolve, reject) => {
      bcrypt.compare(password, usuario.password, (err, res) =>{ // <------ verifica que el hash guardado es el mismo texto plano
        if (res){
          resolve(usuario); // <------ devuelve el usuario, la contraseña es correcta
        } else {
          reject(); // <----- la contraseña es incorrecta
        }
      });
    });
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

UsuarioSchema.pre('save', function (next) {
  usuario = this;

  if (usuario.isModified('password')){
    bcrypt.genSalt(10, (e, salt) =>{
      bcrypt.hash(usuario.password, salt, (e, hash) =>{
        usuario.password = hash;
        next();
      });
    });

  }else {
    next();
  }
});

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
