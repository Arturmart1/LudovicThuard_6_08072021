const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const helmet = require("helmet");

//Connection à la base de données

const mongoConnect = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.qwua6.mongodb.net/${process.env.DB_NAME}?${process.env.DB_SET}`

//Paramètres de connexion à la base de données

mongoose.connect(mongoConnect, {
  useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

const limiter = new RateLimit({
  store: new MongoStore({
    uri: 'mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.qwua6.mongodb.net/${process.env.DB_NAME}?${process.env.DB_SET}',
    user: '${process.env.DB_USERNAME}',
    password: '${process.env.DB_PASSWORD}',
    expireTimeMs: 15 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo')
  }),
  max: 100,
  windowMs: 15 * 60 * 1000
});

app.use(limiter); //Prevent 01 OWASP attack

//CORS

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Utilitaires
app.use(helmet()); //Prevent 02 Owasp attack

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;