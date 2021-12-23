//Import des modules

const express = require('express');
const router = express.Router();

//Imports des controllers et middlewares

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer= require('../middleware/multer-config');

//Consignes de routage

router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.rateSauces);

module.exports = router;