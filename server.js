/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Taimoor Abbasi Student ID: 157265216 Date: 2023-02-22
*
*  Cyclic Web App URL: https://ill-puce-mackerel-veil.cyclic.app/about
*
*  GitHub Repository URL: https://github.com/taimoor1Abbasi/assignment-3
*
********************************************************************************/ 
var express = require("express");
var app = express();
const multer = require("multer");
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
const upload = multer(); // no { storage: storage } 
var path = require('path');
var blog = require(__dirname + "/blog-service.js");
var HTTP_PORT = process.env.PORT || 8080;
cloudinary.config({ 
    cloud_name: 'dlxaiazfi', 
    api_key: '261461771716615', 
    api_secret: 'Zi0PtccMGW6pL2RCte0KbJ5ew2o',
    secure:true
});

onHttpStart = () => {
    console.log('My Express http server listening on port ' + HTTP_PORT);
}

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/blog", (req, res) => {
    blog.getPublishedPosts().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

app.get('/posts', (req,res)=>{
    let getPromise = null;
    if(req.query.category){
        getPromise = blog.getPostsByCategory(req.query.category);
    }else if(req.query.minDate){
        getPromise = blog.getPostsByMinDate(req.query.minDate);
    }else{
        getPromise = blog.getAllPosts()
    } 
    getPromise
        .then(data => res.json(data))
        .catch(err => res.json({message: err}))
});

app.post("/posts/add", upload.single("featureImage"), (req,res)=>{
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
        upload(req).then((uploaded)=>{
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }
    function processPost(imageUrl){
        req.body.featureImage = imageUrl;
        blog.addPost(req.body)
            .then(post=>res.redirect("/posts"))
            .catch(err=>res.status(500).send(err))
    }   
});

app.get('/posts/add', (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/addPost.html"));
}); 

app.get('/post/value', (req,res)=>{
    blog.getPostById(req.params.id)
        .then(data=>res.json(data))
        .catch(err=>res.json({message: err}));
});

app.get("/categories", (req, res) => {
    blog.getCategories().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});

blog.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch ((err) => {
    console.log(err);
});
