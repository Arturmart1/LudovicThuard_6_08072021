const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');

const passwordSchema = new passwordValidator();
  passwordSchema
  .is().min(8)                                    // Minimum 8 caractères
  .is().max(100)                                  // Maximum 100 caractères
  .has().uppercase()                              // Doit contenir au moins une majuscule
  .has().lowercase()                              // Doit contenir au moins une minuscule
  .has().digits(2)                                // Doit avoir au moins 2 chiffres
  .has().not().spaces()                           // Ne doit pas avoir d'espaces
  .is().not().oneOf(['Passw0rd', 'Password123', 'azerty1234']); // Liste de mots de passes interdits

//Création d'un utilisteur
/**
 * @param {hash} /Hash du mot de passe
 * @param {user.save} /Sauvegarde l'utilisateur
 */

exports.signup = (req, res, next) => {
  //Vérification du mot de passe
  if (!passwordSchema.validate(req.body.password), !emailValidator.validate(req.body.email)) {
    return res.status(400).json({ error: 'Mot de passe invalide'});
  }else{
    bcrypt
      .hash(req.body.password, 10) // Hashing and salting the password
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        }); // Create new user
        user
          .save() // Save user in DB
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(403).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

//Connection au site pour un utilisateur enregistré
/**
 * @param {user.findOne} /Trouve l'utilisateur dans la DB
 * @param {bcrypt.compare} /Compare le hash du mot de passe
 * @param {res} /Renvoi le useId et le token
 */

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id }, '${process.env.TOKEN}', { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};