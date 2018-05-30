var mongo      = require('mongodb');
var jwt = require('jsonwebtoken');
var auth = require('./userAuth');

var MongoClient = mongo.MongoClient;
var url = "mongodb://connectUser:" + process.env.DB_PASS + "@maturalniecluster-shard-00-00-ez18o.mongodb.net:27017,maturalniecluster-shard-00-01-ez18o.mongodb.net:27017,maturalniecluster-shard-00-02-ez18o.mongodb.net:27017/test?ssl=true&replicaSet=MaturalnieCluster-shard-0&authSource=admin&retryWrites=true";
console.log("url Con Skema: ", url)

var uploadLib = {
    uploadFile:async (req)=>{
        //check if user has img with this name in his db

        //let usrExists = await auth.userExists(req.body.name)
        //console.log("user exists? ", usrExists);

        //Then put it in his db

        //then upload file
        if(req.files.myfile){
            console.log("upfileOk")
            var file = req.files.myfile,
            name = file.name,
            type = file.mimetype;
            var uploadpath = 'K:\\node\\node_projects\\MaturalnieGit\\Maturalnie\\uploads\\' + name;
            file.mv(uploadpath,function(err){
                if(err){
                    console.log("File Upload Failed",name,err);
                    return ("Error Occured!")
                }
                else {
                    console.log("File Uploaded",name);
                    return ('Done! Uploading files')
                }
            });
        }
        else {
            return ("No File selected !");
        };
    },
    //insertUserIntoDB returns true if it runs ok
    insertFileDataToDB:(name, pass)=>{
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
    }
}

module.exports = uploadLib;


