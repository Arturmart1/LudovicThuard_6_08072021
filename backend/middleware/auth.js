const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, '${process.env.TOKEN}');
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) { //faille ici
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

/*
const jwt = require('jsonwebtoken');


// changer la clé random token qui est trop utilisée et facilement trouvable
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.token = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        next()
    } catch (error) {
        res.status(401).json({
            error: error
        })
    }

};

 */