var geoip = require('geoip-lite');
var RequestModule = require("../modules/requestModule");

var logRequest = function (shortUrl,req) {
    var reqInfo ={};
    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || "Unknown";  


    reqInfo.platform = req.useragent.platform || "Unknown";
    reqInfo.browser = req.useragent.browser || "Unknown"
    var ip = req.headers["x-forward-for"] || req.connection.remoteAddress ||
            req.socket.remotAddress || req.connection.socket.remoteAddress;   /*kinds of ways for getting ip address */

    /*To get user req's country, we need geoip-lite.  Note: sometimes it does not work*/

    var geoips = geoip.lookup(ip);
    if(geoips){
        reqInfo.country = geoips.country;
    }else {
        reqInfo.country = "Unknown";
    }
    reqInfo.timestamp = new Date();
    var request = new RequestModule(reqInfo);
    request.save();
};

var getUrlInfo = function (shortUrl, info, callback) {
  if(info === "totalClicks"){
      RequestModule.count({shortUrl:shortUrl}, function (err, data) {
          callback(data);
      });
      return;
  }
    var groupId = "";
    if(info === "hour"){
        groupId = {
            year:{$year: "$timestamp"},
            month:{$month:"$timestamp"},
            day:{$dayOfMonth:"$timestamp"},
            hour:{$hour:"$timestamp"},
            minutes:{$minute:"$timestamp"}
        }
    }else if(info === "day"){
        groupId = {
            year:{$year: "$timestamp"},
            month:{$month:"$timestamp"},
            day:{$dayOfMonth:"$timestamp"},
            hour:{$hour:"$timestamp"}
        }
    }else if(info === "month"){
        groupId = {
            year:{$year: "$timestamp"},
            month:{$month:"$timestamp"},
            day:{$dayOfMonth:"$timestamp"}
        }
    }else {
        groupId = "$" + info;
    }

    RequestModule.aggregate([
       {
           $match: {
               shortUrl : shortUrl  /*search for all url in db*/
           }
       },
       {
           $sort: {
               timestamp: -1   /*reverse time order*/
           }
       },
       {
           $group: {
               _id: groupId,
               count: {
                   $sum: 1
               }
           }
       }
   ], function (err, data) {
        callback(data);
       });
};

module.exports = {
   logRequest : logRequest,
    getUrlInfo : getUrlInfo
};
