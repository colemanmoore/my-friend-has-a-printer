var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket = require('./socketio-connector');
var router = express.Router();
var formidable = require('formidable');
var FileReader = require('filereader');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res, next) => {
  res.render('index', {});
});

router.post('/print', (req, res, next) => {

  var form = formidable();

  form.parse(req, function(err, fields, files) {
    if (err) {
      next(err);
      return;
    }

    if (fields.passcode !== process.env.HONEYJAR) {
      res.render('confirmation', {
        error: true,
        message: 'Sorry - ask your friend for the passcode again'
      });
      return;
    }
    console.log(files)

    var file = files.file_to_print;
    if (!file) {
      res.render('confirmation', {
        error: true,
        message: 'Sorry, we didn\'t receive your file'
      });
      return;
    }

    console.log((Object.getOwnPropertyNames(file).filter(function (p) {
      return typeof file[p] === 'function';
    })));

    otherMethod(file)

    // socket.io.emit('my-friend-request-print', {});
    res.render('confirmation', { message: 'Your file is being printed!' });
  });
});

function otherMethod(file) {
  var fileReader = new FileReader();
  var slice = file.slice(0, 100000);

  fileReader.readAsArrayBuffer(slice);
  fileReader.onload = (evt) => {
    var arrayBuffer = fileReader.result;
    socket.emit('upload-file-slice', {
      name: file.name,
      type: file.type,
      size: file.size,
      data: arrayBuffer
    });
  }
}

app.use(router);

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
