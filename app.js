var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

const { sequelize } = require('./models/index');
const seedUsers = require('./seed');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const classroomsRoutes = require('./routes/classroom');
const assignmentRoutes = require('./routes/assignment');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/api/users', authRoutes);
app.use('/api/classrooms', classroomsRoutes);
app.use('/api/assignments', assignmentRoutes);

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

  sequelize.sync({ force: true })
  .then(() => {
    console.log('Database and tables created.');
    seedUsers();  // Call the seed function
}).catch(err => console.error('Error creating database tables:', err));

  

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
