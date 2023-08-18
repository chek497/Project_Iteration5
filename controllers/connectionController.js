/*
connection controller module: include controller functions to handle requests
associated with connections.
Update each route defined in the connection route module to call
the corresponding controller function.
*/

const model = require('../models/connection');
const User = require('../models/user');
const RSVP = require('../models/rsvp');

exports.index = (req, res, next) => {
  const id = req.session.user;
  Promise.all([model.find().populate('author', 'firstName lastName'), User.findById(id)])
    .then((results) => {
      const [connections, user] = results;
      res.render('./connection/index', { user, connections });
    })
    .catch((err) => next(err));
};

exports.new = (req, res) => {
  const id = req.session.user;
  User.findById(id)
    .then((results) => {
      const user = results;
      res.render('./connection/new', { user });
    })
    .catch((err) => next(err));
};

exports.create = (req, res, next) => {
  console.log('Create is running.');
  const connection = new model(req.body); // create a new connection document
  connection.author = req.session.user;
  connection.save() // insert document to the database
    .then((connection) => {
      req.flash('success', 'Connection has been created successfully');
      res.redirect('/connections');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      next(err);
    });
};

exports.show = (req, res, next) => {
  const { id } = req.params;
  const userid = req.session.user;
  Promise.all([model.findById(id).populate('author', 'firstName lastName'), User.findById(userid), RSVP.count({ connectionId: id, status: 'Yes' })])
    .then((results) => {
      const [connection, user, rsvp] = results;
      if (results) {
        return res.render('./connection/show', { connection, user, rsvp });
      }
      const err = new Error(`Cannot find a connection with id ${id}`);
      err.status = 404;
      next(err);
    })
    .catch((err) => next(err));
};

exports.edit = (req, res, next) => {
  const { id } = req.params;
  model.findById(id)
    .then((connection) => res.render('./connection/edit', { connection }))
    .catch((err) => next(err));
};

exports.rsvp = (req, res, next) => {
  RSVP.findOneAndUpdate(
    { author: req.session.user, connectionId: req.params.id },
    { status: req.body.rsvp, topic: req.body.topic, name: req.body.name },
    { upsert: true, new: true, runValidators: true },
  )
    .then((rsvp) => {
      req.flash('success', 'RSVP has been created successfully');
      res.redirect(`/connections/${req.params.id}`);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      next(err);
    });
};

exports.update = (req, res, next) => {
  const connection = req.body;
  const { id } = req.params;

  model.findByIdAndUpdate(id, connection, { useFindAndModify: false, runValidators: true })
    .then((connection) => res.redirect(`/connections/${id}`))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      next(err);
    });
};

exports.delete = (req, res, next) => {
  const { id } = req.params;

  Promise.all([model.findByIdAndDelete(id, { useFindAndModify: false, runValidators: true }),
    RSVP.deleteMany({ connectionId: id }, { useFindAndModify: false, runValidators: true })])
    .then((results) => {
      res.redirect('/users/profile');
    })
    .catch((err) => next(err));
};
