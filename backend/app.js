const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const keys = require('./config/keys')

require('./models/Car');
require('./models/User');
require('./models/Request');
require('./services/passport');
// Add payment gateway
//require('./services/payment')

//Set up default mongoose connection
var mongoDB = keys.mongoURI;
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
  mongoDB = keys.mongoURITEST
} else if (process.env.NODE_ENV === 'production') {
  mongoDB = 'mongodb://db:27017/data';
}
console.log(mongoDB)
// var mongoDB = 'mongodb://db:27017/data';
mongoose.connect(mongoDB, {useNewUrlParser: true});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!!')
});

//////////////////////////////////////

const app = express();
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = require('./swagger/swagger.json')

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)

app.use(require("express-session")({
  secret: 'dlsfkjsdklfjdklsfjdksl',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });

///////////////////////////////////////

require('./routes/authRoutes')(app);
require('./routes/carRoutes')(app);
require('./routes/requestRoutes')(app);
require('./routes/fileRoutes')(app);
require('./routes/billingRoutes')(app);

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));

//   const path = require('path');
//   app.get('*', (req, res) => {
//       const filePath = path.resolve(__dirname, 'client', 'build', 'index.html')
//       res.sendFile(filePath)
//   })
// }

module.exports = app