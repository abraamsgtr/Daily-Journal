//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const popup = require("node-popup");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const port = 4000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.set('', path.join(__dirname, 'public/partials'));
mongoose.connect("mongodb://localhost:27017/dailynewsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const newsSchema = {
  title: {
    type: String,
    require: [true, "Title is required."],
  },
  body: {
    type: String,
    required: [true, "Body is required."],
  },
};

const News = mongoose.model("News", newsSchema);

const news1 = new News({
  title: "Home",
  body: homeStartingContent,
});

const listSchema = {
  title: {
    type: String,
    require: [true, "Title is required."],
  },
  items: [newsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  News.find({}, function (err, doc) {
    if (!err) {
      if (doc.length > 0) {
      } else {
        news1.save();
        res.redirect("/");
      }
    }

    res.render("home", { posts: doc });
  });
});

app.get("/homePage", function (req, res) {
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about", { aboutMeText: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactText: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  // const post = {
  //   title: req.body.postTitle,
  //   body: req.body.postBody,
  // };
  const title = _.toLower(req.body.postTitle);
  const body = _.toLower(req.body.postBody);
  var postExist = false;

  const newNews = new News({
    title: _.capitalize(req.body.postTitle),
    body: _.capitalize(req.body.postBody),
  });

  News.findOne({ title: _.capitalize(title) }, function (err, doc) {
    if (!err) {
      if (doc) {
        res.redirect("/");
      } else {
        console.log("Saved doc.");
        newNews.save();
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  });

  // postsArray.forEach((item) => {
  //   if (item.title.toLocaleLowerCase() === req.body.postTitle) {
  //     postExist = true;
  //   }
  // });
  // if (postExist) {

  // } else {
  //   // postsArray.push(post);
  //   //newNews.save();

  // }
});

// app.get("/posts/:postName", function (req, res) {
//   console.log(`post name = ${req.params.postName}`);
//   const postName = req.params.postName;
//   var matchFound = false;
//   var foundPost = {};

//   postsArray.forEach((item) => {
//     if (_.lowerCase(item.title) === _.lowerCase(postName)) {
//       matchFound = true;
//       foundPost = item;
//     }
//   });
//   if (matchFound) {
//     res.render("post", {
//       postTitle: foundPost.title,
//       postBody: foundPost.body,
//     });
//   } else {
//     res.redirect("/");
//   }
// });

app.get("/posts/:postName", function (req, res) {
  console.log(`post name = ${req.params.postName}`);
  const postId = _.toLower(String(req.params.postName).replace(" ", ""));
  // const postName = req.params.postName;
  // var matchFound = false;
  // var foundPost = {};

  News.findOne({ _id: postId }, function (err, doc) {
    if (!err) {
      if (doc) {
        res.render("post", {
          postTitle: doc.title,
          postBody: doc.body,
        });
      }
    }
  });
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
