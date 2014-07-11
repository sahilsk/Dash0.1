var express = require('express');
var session = require('express-session');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var docker = require("./controllers/dockers");
var index = require("./controllers/index");
var api = require("./controllers/api");
var config = require("config");


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'Dash-S3CR37'}))

app.use(express.static(path.join(__dirname, 'public')));
app.use("/build", express.static(path.join(__dirname, '../Client/build')));


//Authentication :{ username: admin, password: admin123 }
app.use( function( req, res, next){
    if( req.url === "/login"){
        if( req.session.hasOwnProperty("user") && req.session.user !== null ){
            res.redirect("/");
        }else{
            next();
        }
    }else{
        //console.log("Checking authentication...", config);

        if( req.session.hasOwnProperty("user") && req.session.user !== null ){
            next();
        }else{
            res.redirect("/login");
        }
    }

})


//app.use("/login', user");


app.use('/', index);
app.use('/dockers', docker);
app.use('/api', api);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});





module.exports = app;
