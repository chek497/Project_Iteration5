const Connection = require('../models/connection');

// check if user is a guest
exports.isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  req.flash('error', 'You are logged in already');
  return res.redirect('/users/profile');
};

// check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.flash('error', 'You need to log in first');
  return res.redirect('/users/login');
};

// check if user is author of the connection
exports.isAuthor = (req, res, next) => {
  const { id } = req.params;
  Connection.findById(id)
    .then((connection) => {
      if (connection) {
        // eslint-disable-next-line eqeqeq
        if (connection.author == req.session.user) { // using === causes application error
          return next();
        }
        const err = new Error('Unauthorized to access the resource');
        err.status = 401;
        return next(err);
      }
      const err = new Error(`Cannot find a connection with id ${req.params.id}`);
      err.status = 404;
      return next(err);
    })
    .catch((err) => next(err));
};
