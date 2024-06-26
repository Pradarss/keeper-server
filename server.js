require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const session = require("express-session");
// const passport = require("passport");
const cors = require("cors");
const taskroutes = require("./routes/task");
const signup=require("./routes/signup");


const app = express();
const port = 5000;

app.use(cors({
    origin: "http://trello001.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
}))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/",taskroutes);
app.use("/",signup);

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.mp4r9kt.mongodb.net/TrelloDB?retryWrites=true&w=majority&appName=Cluster0`)
.then(function(){
    console.log("Successfully connected to mongoDB")
})
.catch(function(err){
    console.log(err);
})

app.listen(port, function() {
    console.log("Server started on port 5000");
  });