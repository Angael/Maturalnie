var express = require('express');
var fs      = require('fs');
var bodyParser = require('body-parser')
var pug     = require('pug');
var auth = require('./userAuth');
var posts = require('./postsLogic');
var uploadLib = require('./uploadLib');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');
var router  = express.Router();
var upload = require('express-fileupload');


router.use(bodyParser.urlencoded({ extended: false }))
//router.use(bodyParser.json())

router.use(function(req, res, next) {
    //used every time
    console.log("(Something went through router!)");
    next(); // make sure we go to the next routes and don't stop here
});

router.get("/auth/test/:which", function(req, res){ // Group of tests for "asdfgc" that should be in :which
    let which = req.params.which;

    let encrypted = auth.encryptPassword(which);

    console.log("encrypted", encrypted); //34feb914c099df25794bf9ccb85bea72


    let decrypted = auth.decryptPassword(encrypted);

    console.log("decrypted", decrypted); //34feb914c099df25794bf9ccb85bea72

    let hashed = auth.hashPassword(which);

    console.log('hashed', hashed)

    console.log("check if hash is ok");
    if("a2ea5afbdf4653ae4cf7f7a515f7a64f27c888786074ee01a9c90e0ac2ac386a" === hashed){
        console.log('ok')
        
    }else{
        console.log("not ok")
    }

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
router.post("/insertPost", ensureToken,function(req, res){

    checkJwt(req.token, 
        (username)=>{ // in checkJwt it decodes token and gets coded message
            //allrighty
            
            
            let sentPost = JSON.parse(req.body.post);
            console.log("sentPost", sentPost)

            sentPost.author = username //or id

            posts.createPost(sentPost, (isOk)=>{
                if(isOk){
                    res.status(200).send("All ok")
                }else{
                    res.status(500).send("Something gone wrong")
                }
            });

            

        },
        ()=>{
            //error
            res.status(401).send("Bad Token, Can't create this post")
        });
});

router.get("/post/num/:which", function(req, res){
    let which = req.params.which;
    if(isNaN(which) || which == ""){
        res.status(400).send('Bad Number')
        return;
    }else{
        if(req.get("insides")){
            fs.readFile('./paths/postSelected.pug', function (err, pugHtml) {
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
            var html = fn({id:which});

            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(html);
            res.end();
        })
        }else{
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
            var html = fn({path:"/postSelected"});

            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(html);
            res.end();
        })
        }
    }
});

router.get("/api/post/:which", function(req, res){
    let which = req.params.which;
    if(isNaN(which) || which == ""){
        res.status(400).send('Bad Number')
        return;
    }else{
        posts.getPost(req, res,  parseInt(which));
    }
});

router.get("/api/post/:from/:howMany", function(req, res){
    let from = req.params.from;
    let howMany = req.params.howMany;
    if(isNaN(from) || from == "" || isNaN(howMany) || howMany == ""){
        res.status(400).send('Bad Numbers')
        return;
    }else{
        posts.getPosts(req, res, parseInt(from),  parseInt(howMany)); 
    }
});

router.get("/api/tag/post/:tag", function(req, res){
    let tag = req.params.tag;
    posts.getPostsWithTag(req, res, tag); 
    
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
        loadLayoutAndInsides(req, res, "post/create")
    }
});

router.post("/img/upload", upload(), function(req,res){
  //console.log(req.files);
  //console.log("from name:", req.files.myfile);
  //console.log("req.files.upfile --> ", req.files.myfile)
  res.send("Function is in process of being implemented");
  return;

  let uploadMSG = uploadLib.uploadFile(req)
  console.log("post /img/upload done")
  res.send("Status: " + uploadMSG)
})



function checkJwt(token, nextOk, nextErr = ()=>{}){
    jwt.verify(token, 'sekret', function(err, data) {
        if (err) {
            nextErr();
            //make method that will check if jwt is good
        } else {
            console.log("checkJwt()= ", data);
            nextOk(data.user);
        }
    })
}

router.post("/register", function(req, res){
    if(req.get("insides")){
        //ajaxed page
        console.log(req.token)
        checkJwt(req.token, 
        ()=>{
            //allrighty
            loadInsides(req,res,"login")
        },
        ()=>{
            //error
            res.status(401).send("Bad Token")
        });
    }else{
        //page request from url, NOT ajax, so there is no token in header
        console.log("Register Action");
        console.log(req.body)
        //now try anb create user
        if(req.body.name && req.body.pass){
        
            auth.createUser(req.body.name, req.body.pass).then( async ()=> {
                console.log("userExists? [after operation]:", await auth.userExists(req.body.name))
            });
            
        }
        loadLayoutAndInsides(req, res, "login")
    }
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

function loadLayoutAndInsides(req, res, address) { //TODO: zrob by path bylo do wyboru dla post/:which
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


