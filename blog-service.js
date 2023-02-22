const file = require('fs');    
var posts = [];
var categories = [];
exports.initialize = () => {
    return new Promise ((resolve, reject) => {
        file.readFile('./data/posts.json', (err,data) => {
            if (err) {
                reject ('ERROR');
            }
            else {
                posts = JSON.parse(data);
            }
        });
        file.readFile('./data/categories.json', (err,data)=> {
            if (err) {
                reject ('ERROR');
            }
            else {
                categories = JSON.parse(data);
            }
        })
        resolve();})};
exports.getAllPosts = () => {
    return new Promise ((resolve,reject) => {
        if (posts.length == 0) {
            reject('ERROR');
        }
        else {
            resolve(posts);
        }})};
exports.getPublishedPosts = () => {
    return new Promise ((resolve, reject) => {
        var publish = posts.filter(posts => posts.isPublished == true);
        if (publish.length == 0) {
            reject('ERROR');
        }
        resolve(publish);})};
exports.getCategories = () => {
    return new Promise((resolve,reject) => {
        if (categories.length == 0) {
            reject ('ERROR');
        }
        else {
            resolve (categories);}})};

exports.getPostsByMinDate = (minDateStr) => {
                return new Promise((resolve, reject) => {
                    let filteredPosts = posts.filter(post => (new Date(post.postDate)) >= (new Date(minDateStr)))
                    filteredPosts.length == 0
                        ? reject("no results returned")
                        : resolve(filteredPosts);
                });
            }
            
exports.getPostById = (id) =>{
                return new Promise((resolve,reject)=>{
                    let foundPost = posts.find(post => post.id == id);
                    foundPost ? resolve(foundPost) : reject("no result returned");
                });
            }
            
exports.addPost = (postData) =>{
                return new Promise((resolve,reject)=>{
                    postData.published = postData.published ? true : false;
                    postData.id = posts.length + 1;
                    posts.push(postData);
                    resolve();
                });
            }

exports.getPostsByCategory = (category)=>{
                return new Promise((resolve,reject)=>{
                    let filteredPosts = posts.filter(post=>post.category === category);
                    filteredPosts.length == 0
                        ? reject("no results returned")
                        : resolve(filteredPosts);
                });
            }
            
