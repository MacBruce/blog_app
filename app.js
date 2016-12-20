var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//mongoose/ model config
var blogSchema = new mongoose.Schema({
   title: {type: String, default: String},
   image: {type: String, default: String},
   body: {type: String, default: String},
   created: {type: Date, default: Date.now}
});

//mongoosse model
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "test blog",
//     image: "https://unsplash.com/?photo=hVF_04fzKO4",
//     body: "I am some text woohoo"
    
// });

// routes

//intro page -- HOME
app.get('/', function(req, res) {
    res.redirect("/blogs");
});

//list all blogs
app.get('/blogs', function (req, res) {
    Blog.find({}, function(err, blogs) {
       if(err) {
           console.log("error");
       } else {
           res.render("index", {blogs: blogs});
       }
    });
});

//show new blog form create a blog
app.get('/blogs/new', function(req, res) {
    res.render('new');
});

//create new blog post && redirect 
app.post('/blogs', function (req, res) {
    // create blog post
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            //re-render form if err
            res.render("new");
        } else {
            //redirect if success
            res.redirect("/blogs");
        }
    });
});


// show
app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//update
app.put('/blogs/:id', function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

//edit
app.get('/blogs/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//delete route
app.delete("/blogs/:id", function (req, res) {
   Blog.findByIdAndRemove(req.params.id, function (err) {
        if(err) {
             res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
     });
});





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
})