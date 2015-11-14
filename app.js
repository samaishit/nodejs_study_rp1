var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

var requestBaseOptionObject = {
    method:'GET',
	  encoding:'binary'
};
/*
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
*/
//veiw setting
app.set("view engine", 'ejs');

//set middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//set routes
app.get('/intro', function (req,res) {
  requestBaseOptionObject.url = "http://openapi.naver.com/search?" +
                                "key=4e483efff4f07ee183a9fabed8121687&target=news" +
                                "&start=1&display=10&query=" +
                                encodeURIComponent("부동산");
  request(requestBaseOptionObject , function (error, response, body) {
                      if(!error && response.statusCode == 200) {
                        var bufferedBody = new Buffer(body, 'binary');
                        var $ = cheerio.load(bufferedBody);
                        var itemList = $('channel item');
                        var dataArr = new Array();
                        itemList.each(function (v, element) {
                          dataArr.push({
                            title : $(this).children('title').html(),
                            link : $(this).children('originallink').html(),
                            desc : $(this).children('description').html(),
                            date : $(this).children('pubDate').html()
                          });
                        });

                        res.render('intro/index', {data: dataArr});
                      } else {
                        console.log(error);
                      }
                    });
});

//start server
app.listen(3000, function() {
  console.log('Server On!');
});
