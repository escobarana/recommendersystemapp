'use strict' // use all standards from javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Import the mongoose module
var mongoose = require('mongoose');
// var cors = require('cors');

var routesRouter = require('./routes/allRoutes');
var compression = require('compression'); // to compress the routes at the end - production
var helmet = require('helmet'); // to protect against well known vulnerabilities - npm install helmet

var app = express(); // object to run the server

/// view engine setup ///
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); //Compress all routes -- for the end - production
app.use(helmet());

/// Set up default mongoose connection ///
var mongoDB = 'mongodb://156.35.163.172:27017/recommendersystemdb'

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        .then( () => { console.log('Successfully connected to the database.') }) 
        .catch(err => console.log(err));

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error'));


// HEADERS AND CORS CONFIG
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});


/// GETTING THE CLIENT - ANGULAR ///
//var corsOptions = {
//  origin: 'http://localhost:4200',
//  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
//};

 // app.use(cors());


/// Routes ///
app.use('/', express.static('client', { redirect: false }));
app.use('/api', routesRouter); // Add users routes to middleware chain.

// Frinedly and optimized URLs -- avoiding errors when refreshing the page
app.get('*', function(req, res, next){
  res.sendFile(path.resolve('client/index.html'));
});

/// GETTING APPS ///

// API Google Play Store
var playstore   = require('./js/apiGoogle');
// API Apple Store
var appStore    = require('./js/apiApple');
// API R
var r           = require('./js/apiR');
const { Console } = require('console');

var port_plumber = '5970';

var keywords = ['physical activity']; //, 'sedentary behaviour', 'colorectal neoplasms' ,'health exercise'

var listGoogle = [];
var listApple = [];

app.route('/api/apps/google/raw').get((req, res) => {
  req.setTimeout(600000);
  var appsGoogle = playstore.getApps();
  console.log("-----Buscando las apps - GOOGLE");
  appsGoogle.then(function(result_apps_google) {
      console.log("-----Hechas las apps - GOOGLE");
      listGoogle = result_apps_google;
      res.send(listGoogle);
  }, function(err) {
      console.log(err);
  })
});

app.route('/api/apps/google/descriptionApps').get((req, res) => {
  req.setTimeout(600000);
  console.log("-----Buscando las apps sin descripciones - GOOGLE");
  var appsGoogle = playstore.getDescriptions(listGoogle);
  appsGoogle.then(function(result_apps_google) {
      console.log("-----Hechas las apps sin descripciones - GOOGLE");
      listGoogle = result_apps_google;
      listGoogle = listGoogle.filter((arr, index, self) => //elimina los duplicados
      index === self.findIndex((t) => (t.appId === arr.appId)));
      console.log("TAMAÑO GOOGLE: " + listGoogle.length);
      res.send(listGoogle);
  }, function(err) {
      console.log(err);
  })
});

app.route('/api/apps/google/keywords').get((req, res) => {
  req.setTimeout(600000);
  console.log("-----Buscando las apps con keywords - GOOGLE");
  const promises = []
  keywords.forEach(word => 
      promises.push(playstore.getFromKeyword(word)) 
  )
  Promise.all(promises)
  .then(response => {
      console.log("-----Hechas las apps con keywords - GOOGLE");
      var applications = [];
      for(var i=0; i < response.length; i++){ 
          for(var j=0; j < response[i].length; j++){ 
              applications.push(response[i][j]);
          }
      }
      applications.forEach(p => 
          listGoogle.push(p) 
      )
      res.send(listGoogle);
  })
  .catch(error => console.log(`Error in executing ${error}`))
});

app.route('/api/apps/apple/raw').get((req, res) => {
  req.setTimeout(600000);
  var appsApple = appStore.getApps();
  console.log("-----Buscando las apps - APPLE");
  appsApple.then(function(result_apps) {
      console.log("-----Hechas las apps - APPLE");
      listApple = result_apps;
      res.send(listApple);
  }, function(err) {
      console.log(err);
  })
});

app.route('/api/apps/apple/descriptionApps').get((req, res) => {
  req.setTimeout(600000);
  console.log("-----Buscando las apps sin descripciones - APPLE");
  var appsApple = appStore.getDescriptions(listApple);
  appsApple.then(function(result_apps) {
      console.log("-----Hechas las apps sin descripciones - APPLE");
      listApple = result_apps;
      listApple = listApple.filter((arr, index, self) => //elimina los duplicados
          index === self.findIndex((t) => (t.appId === arr.appId)));
      console.log("TAMAÑO APPLE: " + listApple.length);

      var allApps = listApple.concat(listGoogle);
      allApps = allApps.filter(function (el) {
          return el != null;
      });
      app.route('/api/bothStores').get((req, res) => {
          res.send(allApps);
      });

      console.log("allApps.length: ",allApps.length);

      res.send(listApple);
  }, function(err) {
      console.log(err);
  })
});

app.route('/api/apps/apple/keywords').get((req, res) => {
  req.setTimeout(600000);
  console.log("-----Buscando las apps con keywords - APPLE");
  const promises = []
  keywords.forEach(word => 
      promises.push(appStore.getFromKeyword(word)) 
  )
  Promise.all(promises)
  .then(response => {
      console.log("-----Hechas las apps con keywords - APPLE");
      var applications = [];
      for(var i=0; i < response.length; i++){ 
          for(var j=0; j < response[i].length; j++){ 
              applications.push(response[i][j]);
          }
      }
      applications.forEach(p => 
          listApple.push(p) 
      )
      listApple = listApple.filter((arr, index, self) => //elimina los duplicados
          index === self.findIndex((t) => (t.appId === arr.appId)));
      res.send(listApple);
  })
  .catch(error => console.log(`Error in executing ${error}`))
});

app.route('/api/apps/listApps').get((req, res) => {
  console.log("Sending both stores to R");
  var url = 'http://localhost:' + port_plumber + '/dataMining?url=' + 'http:%2F%2Flocalhost:3000%2Fapi%2FbothStores' + '&valueK=' + req.query.valueK;
  var p = r.getAppsFromR(url);
  p.then(values => { 
      console.log(values); 
      res.send(values);
  });
  p.catch(function () {
      console.log("Promise Rejected");
  });
});

/// END GETTING APPS ///



/// ERROR HANDLERS ///

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