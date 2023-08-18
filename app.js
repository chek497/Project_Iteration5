// require modules
const express = require('express');
const config = require('config'); // Config file /config/default.json
const helmet = require('helmet'); // Security Utility

const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
// const { cssContentTypeOptions } = require('./middlewares/set-content-type');
// cssContentTypeOptions is for new security feature
// const serveStatic = require('serve-static'); Use for checking Mime type security feature
const connectionRoute = require('./routes/connectionRoute');
const mainRoute = require('./routes/mainRoute');
const userRoutes = require('./routes/userRoutes');

// create application
const app = express();

// configure application
const port = config.get('server.port');
const host = config.get('server.host');
const url = 'mongodb://localhost:27017/NBAD';
app.set('view engine', 'ejs');

// connect to MongoDB
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
)
  .then(() => {
    // start the server
    app.listen(port, host, () => {
      console.log('Server is running on', host, port);
    });
  })
  .catch((err) => console.log(err.message));

// mount middleware functions
app.use(
  session({
    secret: 'ajfeirf90aeu9eroejfoefj',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: url }),
    cookie: { maxAge: 60 * 60 * 1000, sameSite: 'strict' },
  }),
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Set "X-Frame-Options: DENY" to prevent Clickjacking
app.use(helmet.frameguard({ action: 'DENY' }));
// Sets "X-Content-Type-Options: nosniff" to prevent MIME-sniffing
app.use(helmet.noSniff());

// Disables the "X-Powered-By" header that is leaking framework information
app.disable('x-powered-by');

/*
const setContentTypeOptions = (res, path) => {
    if (serveStatic.mime.lookup(path) === 'text/css') {
      res.setHeader('X-Content-Type-Options', 'nosniff')
    }
  }
  app.use(serveStatic(path.join(__dirname, 'public/css'), {
    setHeaders: setContentTypeOptions
  }));
*/

/*
app.use('/css', express.static(path.join(__dirname + 'public'), {
    setHeaders: function(res, path, stat) {
      res.set("X-Content-Type-Options", 'nosniff');
    }
  }));
*/

/*
app.use(express.static(path.join(__dirname + 'public/css'), {
    setHeaders: function(res, path, stat) {
      res.set("X-Content-Type-Options", 'nosniff');
    }
}));
*/

// app.use(cssContentTypeOptions);
// app.use(express.static(path.join(config.root, 'public')));

// set up routes
app.use('/connections', connectionRoute);
app.use('/main', mainRoute);
app.use('/users', userRoutes);

app.use((req, res, next) => {
  const err = new Error(`The server cannot locate ${req.url}`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    res.status = 500;
    res.message = ('Internal Server Error');
  }

  res.status(err.status);
  res.render('error', { error: err });
  next(); // Necessary? This is final middleware function.
});
