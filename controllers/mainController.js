/*
main controller module: include controller functions to handle requests associated with general site navigation.
Update each route defined in the main route module to call the corresponding controller function.
*/

const model = require('../models/connection');
const User = require('../models/user');

exports.index = (req, res, next) => {
  const id = req.session.user;
  User.findById(id)
    .then((results) => {
      const user = results;
      res.render('main/index', { user });
    })
    .catch((err) => next(err));
};

exports.about = (req, res) => {
  const id = req.session.user;
  User.findById(id)
    .then((results) => {
      const user = results;
      res.render('main/about', { user });
    })
    .catch((err) => next(err));
};

exports.contact = (req, res) => {
  const id = req.session.user;
  User.findById(id)
    .then((results) => {
      const user = results;
      res.render('main/contact', { user });
    })
    .catch((err) => next(err));
};
