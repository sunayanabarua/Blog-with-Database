//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false});

//create a new postSchema that contains a title and content.
const postSchema = {
 title: String,
 content: String
};

// create a new mongoose model using the schema to define your posts collection.
const Post = mongoose.model("Post", postSchema);

let posts = [];

app.get("/", function(req, res){
  //find all the posts in the posts collection.
  Post.find({}, function(err, posts){
    // render that in the home.ejs file
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

//app.post() method for /compose route,
app.post("/compose", function(req, res){
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

//create a new post document using mongoose model.
  const post = new Post ({
    title: postTitle,
    content: postBody
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
//pushing the post into an array
  posts.push(post);
//redirect to the home page
  res.redirect("/");

});

//In the app.get() method for the /post route, we will render the post page with post ID
//when post/_id is tapped,
app.get("/posts/:postId", function(req, res) {
      //  const requestedTitle = _.lowerCase(req.params.postName);
      //we store the id in a variable from params
      const requestedPostId =req.params.postId;
    //  console.log("requestedPostId="+requestedPostId);
        //from the db model Post we find the id which matches
        Post.findOne({_id: requestedPostId}, function(err, post) {
            //renders the post title and content to the browser
                res.render("post", {
                  title: post.title,
                  content: post.content
                });
            });
      });


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
