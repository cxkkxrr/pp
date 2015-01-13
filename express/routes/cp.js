var express = require('express');
var path = require('path');
var router = express.Router();
var ppHttp = require('pushpie-http');
var fs = require('fs');
var exists = fs.existsSync || path.existsSync;
var ppCache = require('pushpie-cache');

var navPageMap = {
  "cp" : 1,
  "index" : 1,
  "spsearch" : 2,
  "addtask" : 2,
  "spdetail" : 2,
  "mytask" : 3,
  "productdetail" : 3,
  "packagedetail" : 3,
  "addpackage" : 3,
  "upgradepackage" : 3,
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
  res.render('cp/index.html', res._pp_tpl_data);
});

//其他页面
router.get(/^\/[a-zA-Z0-9]+.html$/, function(req, res, next) {
  //console.log('==========others========')
  var baseName = path.basename(req.originalUrl || req.url);
  baseName = baseName.split('.')[0];
  var relativePath = 'cp/'+baseName+'.html';
  res._pp_tpl_data.formLabel = ppCache.label;
  //var data = {userInfo:res._pp_user, formLabel:ppCache.label};
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