//Import des modules

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Schema de l'utilisateur

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Utilisation du plugin Mongoose, vérification de l'unicité de l'email

userSchema.plugin(uniqueValidator);

//Export du shéma

module.exports = mongoose.model('User', userSchema);