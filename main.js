//Require ===>
var mainRouter = require('./lib/routerLogic')
var auth = require('./lib/userAuth');
var express    = require('express');
var mongo      = require('mongodb');

var app        = express();
//Variables ===>
console.log("starting app...")
var port = process.env.PORT || 8080;        // set our port

//Routers ===>

//TEST =====================================================================================

// var MongoClient = mongo.MongoClient;
// var url = "mongodb://localhost:27017/mydb";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   db.createCollection("customers", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });
// //auth.createUser("franek", "qwerty")
// ?auth.userExists("franek")?

//============================================================================================

//Processes ===>

//Express Finish ===>
app.set('view engine', 'pug');
app.use(mainRouter);
app.use(express.static('public')); // Allows for files in public to be accessible like so: "localhost:4000/login.html"
//app.use('/module', moduleRouter? not predicted to be used);

// var server = expressLogic(port);
// webSocketLogic(server);

//Start Listning ===>
app.listen(port);

console.log('Waiting on port ' + port);