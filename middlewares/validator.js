const { body } = require('express-validator');
const { validationResult } = require('express-validator');

exports.validateId = (req, res, next) => {
  const { id } = req.params;
  // an objectId is a 24-bit Hex string
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error('Invalid connection id');
    err.status = 400;
    return next(err);
  }
  return next();
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
  body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
  body('email', 'Email must be a valid email address').isEmail().trim().escape()
    .normalizeEmail(),
  body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })];

exports.validateLogin = [body('email', 'Email must be a valid email address').isEmail().trim().escape()
  .normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })];

exports.validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Errors are not empty');
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect('back');
  }
  console.log('Errors are empty');
  return next();
};

exports.validateRSVP = [body('rsvp', 'Invalid RSVP').isIn('Yes', 'No', 'Maybe')];

// Title cannot be empty
// Content must have minimum length of 10 characters
// All date field must be a valid date
// All date field must be after today's date
// All date field must be a valid time
// The end time must come after the start time
exports.validateConnection = [body('name', 'Title cannot be empty').notEmpty().trim().escape(),
  body('details', 'Content must have a minimum length of 10 characters').isLength({ min: 10 }).escape(),
  body('date', 'Date must be a valid date').isDate().isAfter(),
  body('startTime', 'Start time must be a valid time').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime', 'End time must be a valid time').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').custom((endTime, { req }) => {
    const { startTime } = req.body;
    const startTimeMinutes = parseInt(startTime.split(':')[0], 10) * 60 + parseInt(startTime.split(':')[1], 10);
    const endTimeMinutes = parseInt(endTime.split(':')[0], 10) * 60 + parseInt(endTime.split(':')[1], 10);
    if (endTimeMinutes <= startTimeMinutes) {
      console.log(endTimeMinutes, '<=', startTimeMinutes);
      throw new Error('End time must be after start time');
      // req.flash('error', 'End time must be after start time');
    } else {
      return true;
    }
  })];
