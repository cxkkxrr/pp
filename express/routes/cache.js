var express = require('express');
var path = require('path');
var router = express.Router();
var ppHttp = require('pushpie-http');
var ppLogger = require('pushpie-logger');
var ppCache = require('pushpie-cache');

function getLabel(path, cookie, callback){
  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': path,
      'headers': {
        'cookie': cookie
      }
    },
    'callback': function(json){
      var result = [];
      if(json.errorCode == "0"){
        result = json.result || [];
      }else{
        ppLogger.write('error', '[cache getLabel error] path = ' + path);
        ppLogger.write('error', '[cache getLabel error] ' + JSON.stringify(json));
      }
      (typeof(callback) == 'function') && callback(result);
    }
  });
}

ppCache.label = {};
function getAllLabel(callback){
  var loadCount = 4;
  var startTime = (new Date()).getTime();
  getLabel('/appmarket/typesAndLables.do?type=productLabel&token=469071fdec0e18f33e41bc1faddee02b', '', function(data){
    ppCache.label.crowdLabel = data;
    console.log('load crowdLabel ok ======= ['+((new Date()).getTime()-startTime)+']');
    --loadCount || ((typeof(callback)=='function') && callback());
  });
  getLabel('/appmarket/typesAndLables.do?type=expandType&token=469071fdec0e18f33e41bc1faddee02b', '', function(data){
    ppCache.label.pushType = data;
    console.log('load pushType ok ======= ['+((new Date()).getTime()-startTime)+']');
    --loadCount || ((typeof(callback)=='function') && callback());
  });
  getLabel('/appmarket/typesAndLables.do?type=productType&parentId=1&token=469071fdec0e18f33e41bc1faddee02b', '', function(data){
    ppCache.label.productTypeApp = data;
    console.log('load productTypeApp ok ======= ['+((new Date()).getTime()-startTime)+']');
    --loadCount || ((typeof(callback)=='function') && callback());
  });
  getLabel('/appmarket/typesAndLables.do?type=productType&parentId=2&token=469071fdec0e18f33e41bc1faddee02b', '', function(data){
    ppCache.label.productTypeGame = data;
    console.log('load productTypeGame ok ======= ['+((new Date()).getTime()-startTime)+']');
    --loadCount || ((typeof(callback)=='function') && callback());
  });
}
getAllLabel();

//更新缓存
router.get('/update_label_cache', function(req, res, next) {
  getAllLabel(function(){
    res.send((new Date()).toGMTString() + "====//"+JSON.stringify(ppCache.label));
  });
});


//检测并更新缓存
/*router.get('*', function(req, res, next) {
  if(!ppCache.label){ //缓存中还没有数据
    getLabel(req.headers.cookie, function(data){
      ppCache.label = {};
      ppCache.label.productLabel = data;
      next();
    });
  }else{
    next();
  }
});*/



router.post('/addlog', function(req, res, next) {
  res.send(req.body.log);
});



module.exports = router;