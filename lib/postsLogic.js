var mongo      = require('mongodb');
var striptags = require('striptags');

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/mydb";
var auth = require('./userAuth');

var posts = {
    createPost:(sentObj, next)=>{
        MongoClient.connect(url, function(err, db) {
            if (err) 
            {
                throw err;
            }
            
            auth.getUserId(sentObj.author, (id)=>{
                //TODO: check if sentObj is allright, and not hacked (html or script in it)
                if(!id) {
                    console.log("id is not ok")
                    next(false)
                    return
                }
                sentObj.title = posts.escapeHtml(sentObj.title)
                sentObj.author = id;
                sentObj.tags = posts.escapeHtmlTags(sentObj.tags)
                sentObj.content.textHtml = posts.escapeHtml(sentObj.content.textHtml)
                db.collection("posts").insertOne(sentObj, function(err, res) {
                    if (err) 
                    {
                        next(false)
                        throw err;
                    }
                    //console.log(res);
                    console.log("Inserted [ok,number]: ", res.result)
                    db.close();
                    
                    next(true)
                });
            });

            
        });
    },
    getPost:(req, res, which)=>{
        MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    console.log("err1")
                    throw err;
                }

                db.collection("posts").find({}).skip(which).limit(1).toArray(function(err, result) {
                    if (err) 
                    {
                        console.log("err2")
                        throw err;
                    }
                    if(result != null){
                        //console.log(result);
                        res.json(result[0]);
                    }else{
                        //user not found
                        res.status(400).send('Something went wrong')
                    }
                    
                    db.close();
                });
            });
    },
    getPosts:(req, res, which, howMany)=>{
        MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    console.log("err1")
                    throw err;
                }

                //Kiedy robimy aggregate, czyli taki join to musimy zamiast po kropkach
                //to w argumentach podawac wszystkie operatory wybierania z kolekcji
                db.collection("posts").aggregate([
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "user_data"
                    }
                },
                    {$skip: which},
                    {$limit: howMany}
                ]).toArray( function(err, result) {
                    if (err) 
                    {
                        console.log("err2")
                        throw err;
                    }
                    if(result != null){
                        //Zmieniamy id autora na name autora i wywalamy pole z danymi użytkownika
                        console.log("abc",result)
                        result.forEach( (item, index)=>{
                            if (result[index].hasOwnProperty('user_data')) {
                            // do something with `key'
                                result[index].author = result[index].user_data[0].name;
                                delete result[index].user_data
                            }else{
                                console.log("No user data, don't let password leak")
                                return
                            }
                        })
                        
                        res.json(result);
                    }else{
                        //user not found
                        res.status(400).send('Something went wrong')
                    }
                    
                    db.close();
                });
            });
    },
    getPostsOld:(req, res, which, howMany)=>{
        MongoClient.connect(url, function(err, db) {
                if (err) 
                {
                    console.log("err1")
                    throw err;
                }

                db.collection("posts").find({}).skip(which).limit(howMany).toArray( function(err, result) {
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
                        res.status(400).send('Something went wrong')
                    }
                    
                    db.close();
                });
            });
    },
    
    //Escapes from scripts and hrefs
    escapeHtml: function(html){
        //we check if it's a string or an array, so we can return right variable type and check in a right way
        var res = posts.stripTagsPostContent(res);
        res = html.replace(/(<script|<\/script)/gim, "&lt;script&gt;")
        res = res.replace(/href=/gim, "data=")
        return res
    },
    escapeHtmlTags: function(html){
        //we check if it's a string or an array, so we can return right variable type and check in a right way
            let returnArr = [];
            console.log("zxc", html)
            html.forEach((item, index)=>{
                var res = posts.stripTagsTagsContent(res);
                res = item.replace(/(<script|<\/script)/gim, "&lt;script&gt;")
                res = res.replace(/href=/gim, "data=")
                returnArr[index] = res;
            })
            return returnArr;
    },
    stripTagsPostContent: function(html){
        return striptags(html);
    },
    stripTagsTagsContent: function(html){
        return striptags(html, ['a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'ul', 'ol', 'li', 'hr', 'span', 'del', 'div', 'img', 'iframe']);
    }
}

module.exports = posts;