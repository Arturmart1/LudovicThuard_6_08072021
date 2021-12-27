const jwt = require('jsonwebtoken');

//Middleware d'authentification
/**
 * @const {token} /Récupere le token dans la requête d'authentification 
 * @param {token} req /Vérifie le token 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
    try {
        const Bearer = req.headers.authorization.split(' ')[1];
        req.token = jwt.verify(Bearer, '${process.env.TOKEN}');
        next()
    } catch (error) {
        res.status(401).json({
            error: error
        })
    }

};