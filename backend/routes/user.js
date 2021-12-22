//Routeur d'authentification

const express = require('express');
const router = express.Router();

//Récuperation du controller User
const userCtrl = require('../controllers/user');

//Récuperation du middleware de sécurité
const passwordValidator = require('../middleware/passwordValidation');
const emailValidator = require('../middleware/emailValidation');
const limiter = require('../middleware/expressLimiter');

router.post('/signup', userCtrl.signup, emailValidator, passwordValidator);
router.post('/login', userCtrl.login, limiter.max);

module.exports = router;