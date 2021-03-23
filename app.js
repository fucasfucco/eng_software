//jshint esversion:6

const express = require("express");
//const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://fuca:147896325@cluster0.a2bqb.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    Content: String
};

const Article = mongoose.model("Article", articleSchema);



app.listen(3000, () => {
    console.log("Server started on port 3000");
});