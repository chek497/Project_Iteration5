const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute time window
  max: 5, // Maximum of 5 request every minute
  // message: "Too many log in requests. Try again later" //Message if over 5 requests in 1 minute
  handler: (req, res, next) => {
    const err = new Error('Too many log in requests. Try again later');
    err.status = 429;
    return next(err); // Call default error handler
  },
});
