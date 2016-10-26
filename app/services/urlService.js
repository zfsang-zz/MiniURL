var UrlModule = require('../modules/urlModule');
var redis = require('redis');
/*process.env is envir that nodejs pass, port and host is envir var*/
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;


var redisClient = redis.createClient(port,host);

redisClient.flushall(); /* if you do not have any faults in the last time when you use redis, you do not need to implement this sentence,
    but if you want implement the function of preload cache, you need to think it carefully when to flush it*/
var encode = [];

var getCharCode = function (char1, char2) {
    var arr = [];
    var i = char1.charCodeAt(0);
    var j = char2.charCodeAt(0);
    for(;i<=j;i++){
        arr.push(String.fromCharCode(i));
    }
    return arr;
};

encode = encode.concat(getCharCode('A','Z'));
encode = encode.concat(getCharCode('a','z'));
encode = encode.concat(getCharCode('0','9'));

                                       /* pass a callback function params*/
var getShortUrl = function (longUrl, callback) {
    if (longUrl.indexOf('http') === -1) {
        longUrl = "http://" + longUrl;
    }
    redisClient.get(longUrl, function (err, shortUrl) {
        if(shortUrl){
            callback({
                shortUrl:shortUrl,
                longUrl: longUrl
            });
        }else {
                UrlModule.findOne({longUrl:longUrl},function (err,data) {
                if(data){ /*if in db*/
                    callback(data); 
                    redisClient.set(data.shortUrl,data.longUrl);  /*cache key-value pairs*/
                    redisClient.set(data.longUrl, data.shortUrl);
                }else{ 
                    generateShortUrl(function (shortUrl) {  /* generate short url if not found*/
                        var url = new UrlModule({
                            shortUrl: shortUrl,
                            longUrl : longUrl
                        });
                        url.save();
                        callback(url);
                        redisClient.set(shortUrl,longUrl);  
                        redisClient.set(longUrl, shortUrl);
                    });

                }
            }); /*not handle error here*/
        }
    });

};
var generateShortUrl = function (callback) {
    UrlModule.count({}, function (err, num) {
        callback(convertTo62(num));
    })
};

var convertTo62 = function (num) {
    var result = "";
    do {
        result = encode[num%62] + result;
        num = Math.floor(num/62);
    }while(num)
    return result;
};

var getLongUrl = function (shortUrl, callback) {
    redisClient.get(shortUrl,function (err, longUrl) {
        if(longUrl){
            callback({
                longUrl: longUrl,
                shortUrl: shortUrl
            });
        }else {
            UrlModule.findOne({shortUrl:shortUrl}, function (err, data) {
                /*callback anyway because the method in redirect() can handle this problem*/
                callback(data);
                /*but here we need to make sure data has real value and then to save in the cache, because, if data is null, it will save a pair(favicon, null) in cache thus */
                if(data) {
                    redisClient.set(data.longUrl, data.shortUrl);
                    redisClient.set(data.shortUrl, data.longUrl);
                }
            });
        }
    })
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};