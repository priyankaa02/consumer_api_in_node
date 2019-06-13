var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cron = require("node-cron");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const dotenv = require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRoutes = require('./routes/user_routes');
var request = require('request');
var cors = require('cors')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(session({
  secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy', // a secret key you can write your own
  resave: false,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api',userRoutes);
app.options('*', cors());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

cron.schedule("36 6 * * *", function() {
  Keyword.find({data : []}).then(result => {
    console.log(result);
    for(var i = 0;i<result.length;i++)
    {
      var key = result[i].keyword;
      setTimeout( function (i) {
        request('https://jobs.github.com/positions.json?description='+key, { json: true }, (err, res, body) => {
          if (err) { return console.log(err); }
            saveData(key,body);
            console.log("res",res);

    });
    }, 2000);
    }
  })
  });

  function saveData(key,result)
  {

    var myquery = { keyword: key };
    var newvalues = { $set: { data: result } };
    Keyword.findOneAndUpdate(myquery, newvalues, { new: true }, function(err, res) {
      if (err) { throw err; }
      else { console.log("Updated"); }
    });

  }


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
