var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function () {
  console.log("DB connected.");
});
db.on("error", function (err) {
  console.log("DB ERROR :", err);
});

// model setting
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});

var Post = mongoose.model('post', postSchema);
var requestBaseOptionObject = {
    method:'GET',
  	headers:headers,
	  encoding:'binary'
};
//veiw setting
app.set("view engine", 'ejs');

//set middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//set routes
var getPortalEstateInfo() {
  requestBaseOptionObject.url = "http://openapi.naver.com/search?" +
                                "key=c61a937beacba257edbad7cf23056053&target=news" +
                                "&start=1&display=10&query=" +
                                decodeURIComponent("부동산");
  request(requestBaseOptionObject , function (error, response, body) {

  });
}

//start server
app.listen(3000, function() {
  console.log('Server On!');
});
