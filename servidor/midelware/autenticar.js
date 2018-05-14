var {Usuario} = require('../modelos/usuario')

var autentificar = (req, res, next) => { // funcion midelware
  var token = req.header('x-auth'); //<----guarda el token desde el header

  Usuario.findByToken(token).then((usuario) => { //<---- encuentra el usuario desde el token y devuelve el usuario

    if(!usuario){ //<----- verifica si encontro el usuario
      return Promise.reject() //<--- devulve automaticamente al catch si no lo encuntra
    }

    req.usuario = usuario;// <---- asigna el valor del usuario encontrado
    req.token = token; //<---- asigna el valor del token encontrado
    next();
  }).catch((e) => {
    res.status(401).send(); //<----- 401 devuelve error de auntenticacion
  });
};

module.exports = {autentificar};
