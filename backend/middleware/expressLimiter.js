//Configuration Express rate limit

const rateLimit = require("express-rate-limit");

const max = rateLimit({
  windowMs: 3 * 60 * 1000, // délai en ms / 3 minutes
  max: 5, // nombre de tentatives autorisées
});

module.exports = {max};