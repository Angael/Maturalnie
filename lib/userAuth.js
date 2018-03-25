var mongo      = require('mongodb');
var jwt = require('jsonwebtoken');
var crypto = require('crypto'); // TODO: TEMPORARY DELETE LATER, move logic to auth


var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/mydb";

var Auth = {
    userExists:(name)=>{
        var promise = new Promise(function(resolve, reject){
            let isExisting = false;
            MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    console.log("err1")
                    reject(true)
                    throw err;
                }

                db.collection("users").findOne({name:name}, function(err, result) {
                    if (err) 
                    {
                        console.log("err2")
                        reject(true)
                        throw err;
                    }
                    //console.log("result: ",result);
                    if(result != null){
                        //console.log("he exists")
                        isExisting = true;
                        
                    }
                    db.close();
                    (isExisting) ? console.log("Already Exists") : console.log("Didn't Exists")
                    resolve(isExisting)
                });
            });
        });
        return promise;
    },
    //insertUserIntoDB returns true if it runs ok
    insertUserIntoDB:(name, pass)=>{
        var promise = new Promise(function(resolve, reject){
            MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    reject(false)
                    throw err;
                }
                

                var myobj = { name: name, pass:pass };
                db.collection("users").insertOne(myobj, function(err, res) {
                    if (err) 
                    {
                        reject(false)
                        throw err;
                    }
                    //console.log(res);
                    console.log("Inserted [ok,number]: ", res.result)
                    resolve(true);
                    db.close();
                });
            });
        });
    },
    //createUser checks if username is taken, and calls insertUserIntoDB
    createUser: async (name, pass)=>{
        //check if exists
        var isExisting = await Auth.userExists(name);
        if(!isExisting){
            //insert user and check if all ok
            var isInserted = await Auth.insertUserIntoDB(name,Auth.hashPassword(pass));
            console.log("isInserted:",await isInserted)
            if(await isInserted){
                console.log("Create User Success");
            }
        }
    },

    login: (name, pass, req, res) => {
        MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    console.log("err1")
                    throw err;
                }

                db.collection("users").findOne({name:name}, function(err, result) {
                    if (err) 
                    {
                        console.log("err2")
                        throw err;
                    }
                    if(result != null){
                        if(result.name == name){
                            console.log("good username")
                            //if(result.pass === pass){ STARY SPOSÓB NA SPRAWDZANIE, BEZ HASHOWANIA
                            if(result.pass === Auth.hashPassword(pass)){
                                console.log("logged in")

                                const token = jwt.sign({ user: result.name }, 'sekret');
                                res.json({
                                    message: 'Authenticated!',
                                    token: token
                                });

                            }else{
                                //bad password
                                res.status(401).send('Bad Password')
                            }
                        }else{
                            res.status(400).send('This should never happen rly')
                            throw "this shouldn't happen, pls look what happened , name != name";
                        }
                    }else{
                        //user not found
                        res.status(400).send('No such user found')
                    }
                    
                    db.close();
                });
            });

        //hash password
        //get login and pass from database
        //check if both hashes match
    },
    getUserId : (name, next) => {
        MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    console.log("err1")
                    next(null);
                    throw err;
                }
                db.collection("users").findOne({name:name}, function(err, result) {
                    if (err) 
                    {
                        console.log("err2")
                        next(null);
                        throw err;
                    }
                    if(result != null){
                        if(result.name == name){
                            console.log("good username", result._id)
                            next(result._id)
                            
                        }else{
                            next(null);
                            throw "this shouldn't happen, pls look what happened , name != name, probably case-insensitive?";
                        }
                    }else{
                        //user not found
                        //res.status(400).send('No such user found')
                        console.log("No user with this name")
                        next(null)
                    }
                    
                    db.close();
                });
            });

        //hash password
        //get login and pass from database
        //check if both hashes match
    },
    encryptPassword : (password) => {
        var textBuffer = new Buffer(password, 'utf8');
        var cipher = crypto.createCipher('aes-256-ecb', "hello");
        cipher.write(textBuffer);
        cipher.end();
        let result =  cipher.read().toString('hex');

        return result;
    },
    decryptPassword : (hexString) => {
        var hexBuffer = new Buffer(hexString, 'hex');
        var decipher = crypto.createDecipher('aes-256-ecb', "hello");
        decipher.write(hexBuffer);
        decipher.end();
        var data = decipher.read().toString('utf8');
        return data;
    },
    hashPassword : (password) => {
        const crypto = require('crypto');

        const hash = crypto.createHash('sha256');

        hash.update(password);
        let hashedPassword = hash.digest('hex');
        
        return hashedPassword;
    }

}

module.exports = Auth;


