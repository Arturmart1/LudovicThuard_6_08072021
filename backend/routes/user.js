//Import des modules
//Import du routeur

const express = require('express');
const router = express.Router();

//Récuperation du controller User

const userCtrl = require('../controllers/user');

//Récuperation du middleware de sécurité

const emailValidator = require('../middleware/emailValidation');
const limiter = require('../middleware/expressLimiter');

//Consignes de routage

router.post('/signup', userCtrl.signup, emailValidator);
router.post('/login', userCtrl.login, limiter.max);

module.exports = router;