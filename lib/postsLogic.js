var mongo      = require('mongodb');

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/mydb";

var posts = {
    createPost:()=>{
            MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    throw err;
                }
                
                var myobj = { title: `Kinematyka - ruch jednostajny`, 
                author:"Id",
                tags:["matematyka","polski","angielski","fizyka","chemia"],
                content:{
                    imgLocal:false,
                    imgLink:"http://via.placeholder.com/1250x650",
                    textHtml:`Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec </div>`,
                    link:"it",
                    videoLocal:false,
                    video:null,
                    localFiles:null
                } };
                db.collection("posts").insertOne(myobj, function(err, res) {
                    if (err) 
                    {
                        throw err;
                    }
                    //console.log(res);
                    console.log("Inserted [ok,number]: ", res.result)
                    db.close();
                });
            });
    },
    getPost:(req, res)=>{
        MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    console.log("err1")
                    throw err;
                }

                db.collection("posts").findOne({}, function(err, result) {
                    if (err) 
                    {
                        console.log("err2")
                        throw err;
                    }
                    if(result != null){
                        //console.log(result);
                        res.json(result);
                    }else{
                        //user not found
                        res.status(400).send('No such user found')
                    }
                    
                    db.close();
                });
            });
    }
    
    
}

module.exports = posts;


