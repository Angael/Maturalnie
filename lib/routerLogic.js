var express = require('express');
var fs      = require('fs');
var bodyParser = require('body-parser')
var pug     = require('pug');
var auth = require('./userAuth');
var posts = require('./postsLogic');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');
var router  = express.Router();

router.use(bodyParser.urlencoded({ extended: false }))
//router.use(bodyParser.json())

router.use(function(req, res, next) {
    //used every time
    console.log("(Something went through router!)");
    next(); // make sure we go to the next routes and don't stop here
});

    //When user sees /api/ page without arguments
router.get("/", function(req, res){
    //two same methods of getting header "insides"
    //console.log(req.get("insides"))
    //console.log(req.headers.insides);
    if(req.get("insides")){
        loadInsides(req, res, "home")
    }else{
        loadLayoutAndInsides(req, res, "home")
    }
    
});

router.get("/home", function(req, res){
    if(req.get("insides")){
        loadInsides(req, res, "home")
    }else{
        loadLayoutAndInsides(req, res, "home")
    }
});

router.get("/explore", function(req, res){
    if(req.get("insides")){
        loadInsides(req, res, "explore")
    }else{
        loadLayoutAndInsides(req, res, "explore")
    }
});

//TODO: Delete this insertPost
router.get("/insertPost", function(req, res){
    posts.createPost();
    if(req.get("insides")){
        loadInsides(req, res, "explore")
    }else{
        loadLayoutAndInsides(req, res, "explore")
    }
});

router.get("/post", function(req, res){
    posts.getPost(req, res);
    // if(req.get("insides")){
    //     loadInsides(req, res, "explore")
    // }else{
    //     loadLayoutAndInsides(req, res, "explore")
    // }
});

router.get("/login", function(req, res){
    if(req.get("insides")){
        loadInsides(req, res, "login")
    }else{
        loadLayoutAndInsides(req, res, "login")
    }
});

router.post("/login", function(req, res){
    console.log("Login Action");
    console.log(req.body.name)
    auth.login(req.body.name, req.body.pass, req , res)
    
    // fs.readFile('./public/login.pug', function (err, pugHtml) {
    //     if (err) {
    //         throw err;
    //     }
    //     //get function from index.pug
    //     var fn = pug.compile(pugHtml.toString());
    //     //change title message. YouAreUsingPug changes one if statement
    //     var html = fn();

    //     res.writeHeader(200, {"Content-Type": "text/html"});
    //     res.write(html);
    //     res.end();
    // });
});

router.get("/protected", ensureToken, function(req, res){
    if(req.get("insides")){
        //ajaxed page
        console.log(req.token)
        checkJwt(req.token, 
        ()=>{
            //allrighty
            loadInsides(req,res,"protected")
        },
        ()=>{
            //error
            res.status(401).send("Bad Token")
        });
    }else{
        //page request from url, NOT ajax, so there is no token in header
        loadLayoutAndInsides(req, res, "protected")
    }
});

router.get("/post/create", ensureToken, function(req, res){
    if(req.get("insides")){
        //ajaxed page
        console.log(req.token)
        checkJwt(req.token, 
        ()=>{
            //allrighty
            loadInsides(req,res,"createPost")
        },
        ()=>{
            //error
            res.status(401).send("Bad Token")
        });
    }else{
        //page request from url, NOT ajax, so there is no token in header
        loadLayoutAndInsides(req, res, "createPost")
    }
});

function checkJwt(token, nextOk, nextErr = ()=>{}){
    jwt.verify(token, 'sekret', function(err, data) {
        if (err) {
            nextErr();
            //make method that will check if jwt is good
        } else {
            nextOk();
        }
    })
}

router.post("/register", function(req, res){
    console.log("Register Action");
    console.log(req.body)
    //now try anb create user
    if(req.body.name && req.body.pass){
        
        auth.createUser(req.body.name, req.body.pass).then( async ()=> {
            console.log("userExists? [after operation]:", await auth.userExists(req.body.name))
        });
        
    }
    fs.readFile('./public/login.pug', function (err, pugHtml) {
        if (err) {
            throw err;
        }
        //get function from index.pug
        var fn = pug.compile(pugHtml.toString());
        //change title message. YouAreUsingPug changes one if statement
        var html = fn();

        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    });
});

// router.route('/ourtube')
//     .get(function(req, res) {
//         //console.log(req.headers);
//         console.log("Ourtube");
//         //Layout File
//         fs.readFile('./paths/layout.pug', function (err, pugHtml) {
//         if (err) {
//             res.writeHeader(404, {"Content-Type": "text/html"});
//             res.write("Didn't find page");
//             res.end();
//             throw err;
//         }
//         //get function from index.pug
//         var fn = pug.compile(pugHtml.toString());
//         //url from client to access
//         var html = fn({path:"/protected"});

//         res.writeHeader(200, {"Content-Type": "text/html"});
//         res.write(html);
//         res.end();
//     });
// });

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    req.token = null;
    //Can't throw error, cause sometimes you access /protected directly from url, and not ajax
    //res.sendStatus(403);
    next();
  }
}

function loadLayoutAndInsides(req, res, address) {
    //console.log(req.headers);
    console.log("Ourtube");
    //Layout File
    fs.readFile('./paths/layout.pug', function (err, pugHtml) {
        if (err) {
            res.writeHeader(404, {"Content-Type": "text/html"});
            res.write("Didn't find page");
            res.end();
            throw err;
        }
        //get function from index.pug
        var fn = pug.compile(pugHtml.toString());
        //url from client to access
        var html = fn({path:"/"+address});

        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    })
}
function loadInsides(req, res, address) {
    fs.readFile('./paths/'+address+'.pug', function (err, pugHtml) {
        if (err) {
            res.writeHeader(404, {"Content-Type": "text/html"});
            res.write("Didn't find page");
            res.end();
            return 
            //throw err;
        }
        //get function from index.pug
        var fn = pug.compile(pugHtml.toString());
        //url from client to access
        var html = fn();

        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    })
}
module.exports = router;


