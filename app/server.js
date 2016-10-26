var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var useragent = require('express-useragent');

//Do change here to connect to your DB
 mongoose.connect("mongodb://user:user@your-db");
app.use(useragent.express()); /*http request processing: allow http req go through useragent to include（
"browser":"Chrome",
    "version":"17.0.963.79",
    "os":"Windows 7",
    "platform":"Microsoft Windows",
    "source":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79..."
）*/
app.use("/public" , express.static(__dirname + "/public"));
app.use("/node_modules" , express.static(__dirname + "/node_modules"));

app.use("/api/v1",restRouter);
app.use("/:shortUrl",redirectRouter);
app.use("/",indexRouter);

app.listen(3000);