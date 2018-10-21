require('./server/config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
const helmet = require('helmet')
var compression = require('compression')


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var apisRouter = require('./routes/api');
var sitemapRouter = require('./routes/sitemap');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

require('./hbsregistry.js');


app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: process.env.SESSION_SECRET}));
// if(process.env.APP_ENVIRONMENT === 'prod') {
//   app.all(/.*/, function(req, res, next) {
//     var host = req.header("host");
//     if (host.match(/^www\..*/i)) {
//       next();
//     } else {
//       res.redirect(301, "http://www." + host);
//     }
//   });  
// }

app.use(express.static(path.join(__dirname, 'public')));


app.use('/sitemaps', sitemapRouter);
app.use('/admin', adminRouter);
app.use('/api', apisRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
