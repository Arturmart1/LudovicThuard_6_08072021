//Import module validation du mot de passe

const passwordValidator = require('password-validator');

// Création du shema de validation du mot de passe

const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                    // Minimum 8 caractères
.is().max(100)                                  // Maximum 100 caractères
.has().uppercase()                              // Doit contenir au moins une majuscule
.has().lowercase()                              // Doit contenir au moins une minuscule
.has().digits(2)                                // Doit avoir au moins 2 chiffres
.has().not().spaces()                           // Ne doit pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123', 'azerty1234']); // Liste de mots de passes interdits

//Export du shéma

module.exports = passwordSchema;