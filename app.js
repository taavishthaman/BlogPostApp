//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash")
const mongoose  = require("mongoose")

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser : true});

const blogSchema = new mongoose.Schema({
  title : String,
  content : String
})

const Blog = mongoose.model("Blog", blogSchema);

const homeStartingBlog = new Blog({
    title : "Home",
    content : "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo.Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculisat erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus.Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing"
})

const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi iaculis gravida sapien a accumsan. Sed eu euismod ante. Cras mollis, dui et viverra luctus, velit arcu dapibus quam, sed auctor nibh lacus id metus. Praesent luctus condimentum felis, vitae fringilla ligula congue molestie. Integer at arcu diam. Nunc imperdiet sodales diam, venenatis consectetur elit porttitor pretium. Nulla nec luctus lectus, vitae consectetur nulla. Sed viverra nunc felis, quis fermentum orci placerat in. Nulla eget quam nunc. Fusce interdum mattis aliquam. Praesent vehicula odio id quam vestibulum, sit amet facilisis enim efficitur."


const contactContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi iaculis gravida sapien a accumsan. Sed eu euismod ante. Cras mollis, dui et viverra luctus, velit arcu dapibus quam, sed auctor nibh lacus id metus. Praesent luctus condimentum felis, vitae fringilla ligula congue molestie. Integer at arcu diam. Nunc imperdiet sodales diam, venenatis consectetur elit porttitor pretium. Nulla nec luctus lectus, vitae consectetur nulla. Sed viverra nunc felis, quis fermentum orci placerat in. Nulla eget quam nunc. Fusce interdum mattis aliquam. Praesent vehicula odio id quam vestibulum, sit amet facilisis enim efficitur."


/*const aboutStartingBlog = new Blog({
    title : "About",
    content : "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo.
    Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis
    at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus.
    Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
})

const contactStartingBlog = new Blog({
    title : "Contact",
    content : "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo.
    Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis
    at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus.
    Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
})*/

const posts = [homeStartingBlog]


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    Blog.find({}, function(err, results){
        if(!err){
          if(results.length === 0){
            Blog.insertMany(posts, function(err){
              if(err){
                console.log(err)
              }
              else{
                console.log("Successfully saved default items to the database");
              }
            });
            res.redirect("/")
          }
          else{
              res.render (__dirname+"/views/home.ejs", {homeStartingContent: results[0], blogPosts : results.slice(1)})
          }
        }
    })
})

app.get("/about", function(req, res){
    res.render (__dirname+"/views/about.ejs", {aboutContent : aboutContent})
})

app.get("/compose", function(req, res){
    res.render (__dirname+"/views/compose.ejs")
})

app.post("/compose", function(req, res){
    var postTitle = req.body.blog_title
    var body = req.body.blog_post
    const blog = new Blog({
        title : postTitle,
        content : body
    })
    blog.save()

    res.redirect("/")
})

app.get("/contact", function(req, res){
    res.render (__dirname+"/views/contact.ejs", {contactContent : contactContent})
})

app.get('/posts/:postTitle', function (req, res) {
   var found = false
   var requiredString = req.params.postTitle
   console.log(requiredString)

   Blog.findById(requiredString, function(err, postData){
     if(!err){
       console.log(postData)
       res.render(__dirname+"/views/post.ejs", {postTitle : postData.title, postContent : postData.content})
     }
   })

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
