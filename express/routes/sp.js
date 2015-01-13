var express = require('express');
var path = require('path');
var router = express.Router();
var ppHttp = require('pushpie-http');
var ppLogger = require('pushpie-logger');
var fs = require('fs');
var exists = fs.existsSync || path.existsSync;
var ppCache = require('pushpie-cache');

var navPageMap = {
  "sp" : 1,
  "index" : 1,
  "cpsearch" : 2,
  "cpdetail" : 2,
  "searchresult" : 2,
  "mytask" : 3,
  "taskdetail" : 3,
  "evaluation" : 3,
  "message" : 4,
  "mynotice" : 4,
  "userinfo" : 5,
  "qualification" : 5,
  "qualificationreview" : 5,
  "pwd" :5
};

//处理左侧导航
router.get(['/', /^\/[a-zA-Z0-9]+.html$/], function(req, res, next) {
  var baseName = path.basename(req.originalUrl || req.url);
  baseName = baseName.split('.')[0];
  res._pp_tpl_data.navType = navPageMap[baseName] || 0;
  next();
});

//首页
router.get(['/','/index.html'], function(req, res, next) {
  res.render('sp/index.html', res._pp_tpl_data);
});


//cpdetail
router.get(['/cpdetail.html'], function(req, res, next) {
  var pid = req.query.pid;
  if(!pid){
    res.redirect('cpsearch.html');
    return;
  }

  function _render(json){
    //console.log(json);
    /*json = {"errorCode":"0", "result":{
      "logo": "../images/32x32.jpg",
      "name": "微信",
      "versionNumber": "1.2.1",
      "packageSize": "79M",
      "unitPrize": "2.5",
      "hasPackage": true,
      "billingType": "billingType",
      "quantity": "quantity",
      "pushRequirement": "pushRequirement",
      "pushType": "pushType",
      "dataCycle": "dataCycle",
      "desc": "的说法都是梵蒂冈电饭锅东方红地方给东方红的海哥发给大概规划股份发大概风光好发给第三方给东方红返回分公司的凡事都电饭锅电饭锅电饭是梵蒂冈电饭锅东方红地方给东方红的海哥发给大概规划股份发大概风光好发给第三方给东方红返回分公司的凡事都电饭锅电饭锅电饭是梵蒂冈电饭锅东方红地方给东方红的海哥发给大概规划股份发大概风光好发给第三方给东方红返回分公司的凡事都电饭锅电饭锅电饭锅",
      "imgList":["../images/32x32.jpg","../images/32x32.jpg","../images/32x32.jpg"]
    }};*/
    //console.log(json);
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
        // detailJson.status=1
        // detailJson.applyStatus=1
        // detailJson.hasSparePackageCount=0
      }else{
        detailJson = {};
        ppLogger.write('error', '[cpdetail.html error] result is empty.');
        //res.redirect('cpsearch.html');
        //return;
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '[cpdetail.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('sp/cpdetail.html', res._pp_tpl_data);
  }

  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/task.do?action=showTaskById&id='+pid+'&token=469071fdec0e18f33e41bc1faddee02b',
      'headers': {
        'cookie': req.headers.cookie
      }
    },
    'callback': _render
  });
});


//其他页面
router.get(/^\/[a-zA-Z0-9]+.html$/, function(req, res, next) {
  //console.log('==========others========')
  var baseName = path.basename(req.originalUrl || req.url);
  baseName = baseName.split('.')[0];
  var relativePath = 'sp/'+baseName+'.html';
  res._pp_tpl_data.formLabel = ppCache.label;
  res.render(relativePath, res._pp_tpl_data, function(err, str){
    var absolutePath = path.join(req.app.get('views'), relativePath);
    if(err && !exists(absolutePath)){ //找不到模板
      err = new Error('404 Not Found');
      err.status = 404;
      next(err);
    }
    res.send(str);
  });
});


module.exports = router;