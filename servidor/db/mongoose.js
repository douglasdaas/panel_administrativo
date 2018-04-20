const mongoose = require('mongoose'); //<---- libreria para manejo mas sencillo de mongodb

mongoose.Promise = global.Promise; //<---- indica a mongoose que tipo de callback function se usaran
mongoose.connect('mongodb://localhost:27017/PanelAdministrativo');// <---- inicia la coneccion a la BD

module.exports = {mongoose};
