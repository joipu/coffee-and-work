var createError     = require('http-errors'),
    express         = require('express'),
    path            = require('path'),
    cookieParser    = require('cookie-parser'),
    logger          = require('morgan'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    flash           = require('connect-flash'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override'),
    User            = require('./models/user'),
    seedDB          = require('./seeds')

var indexRouter     = require('./routes/index'),
    commentRouter   = require('./routes/comments'),
    shopRouter      = require('./routes/shops')

var app = express();

// connect mongoose
mongoose.connect('mongodb://localhost:27017/coffee_and_work', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// start seedDB every time when server starts
// seedDB();

// Passport Configuration
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use('/', indexRouter);
app.use('/shops', shopRouter);
app.use('/shops/:id/comments', commentRouter);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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

// Start server
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("server  starts!");
});
