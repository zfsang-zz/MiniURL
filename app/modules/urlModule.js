var mongoose = require('mongoose');
var Schema = mongoose.Schema; /*Table schema*/

var UrlSchema = new Schema({
    shortUrl : String,
    longUrl : String
});

var urlModule = mongoose.model("UrlModule", UrlSchema); /*url db schema*/

module.exports = urlModule;
