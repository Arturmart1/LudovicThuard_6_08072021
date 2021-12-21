const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

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

//  apply to all requests
app.use(limiter);