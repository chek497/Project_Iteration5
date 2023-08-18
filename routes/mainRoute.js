// Main Routes
// All requests associated with general site connection including home, contact, and about

const path = require('path');
const express = require('express');
const controller = require('../controllers/mainController');

// const { cssContentTypeOptions } = require('../middlewares/set-content-type');
// Code snippet for MIME type security check feature

const publicDir = path.join(__dirname, 'public/css');
console.log(publicDir);

const router = express.Router();

// GET /main
router.get('/', /* cssContentTypeOptions, */ controller.index);
// router.get('./main/index', controller.index);

// GET /main/about
router.get('/about', controller.about);

// GET /main/contact
router.get('/contact', controller.contact);

module.exports = router;
