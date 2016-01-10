var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require("underscore");

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

//static directory setting
app.use("/node_modules",express.static(__dirname + "/node_modules"));

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

  requestEstateNewsUrl = "http://land.naver.com/news/headline.nhn";
  request(requestEstateNewsUrl , function (error, response, body) {
                      if(!error && response.statusCode == 200) {
                        var bufferedBody = new Buffer(body, 'euckr');
                        var $ = cheerio.load(bufferedBody);
                        var itemList = $('#content .headline_list li dl');
                        var dataArr = [];
                        itemList.each(function (v, element) {
                          var titleObj = $(this).children('dt').length == 1 ?
                                        $(this).children('dt')[0] :
                                        $(this).children('dt')[1] ;

                          dataArr.push({
                            title : $(titleObj).children('a').html(),
                            link : "http://land.naver.com" + $(titleObj).children('a').attr('href'),
                            date : $(this).children('dd').children('.date').html(),
                            desc : $(this).children('dd').remove('span').text()

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
