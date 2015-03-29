var express = require('express');
var path = require('path');
var router = express.Router();
var ppHttp = require('pushpie-http');
var ppLogger = require('pushpie-logger');
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
  function _render(json){
    //console.log(json);
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
      }else{
        detailJson = {};
        ppLogger.write('error', '[cp/index.html error] result is empty.');
        //res.redirect('cpsearch.html');
        //return;
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '[cp/index.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('cp/index.html', res._pp_tpl_data);
  }

  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/center/boardInfo.do?token=469071fdec0e18f33e41bc1faddee02b',
      'headers': {
        'cookie': req.headers.cookie
      }
    },
    'callback': _render
  });
});

//evaluation
router.get(['/evaluation.html'], function(req, res, next) {
  var applyId = req.query.applyId;
  if(!applyId){
    res.redirect('productdetail.html');
    return;
  }

  function _render(json){
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
      }else{
        detailJson = {};
        ppLogger.write('error', '[evaluation.html error] result is empty.');
        //res.redirect('productdetail.html');
        //return;
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '[evaluation.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('cp/evaluation.html', res._pp_tpl_data);
  }

  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/task.do?action=getApplyTotalAmount&applyId='+applyId+'&token=469071fdec0e18f33e41bc1faddee02b',
      'headers': {
        'cookie': req.headers.cookie
      }
    },
    'callback': _render
  });
});


//productdetail addpackage upgradepackage
router.get(['/productdetail.html','/addpackage.html','/upgradepackage.html'], function(req, res, next) {
  var taskId = req.query.taskId;
  if(!taskId){
    res.redirect('mytask.html');
    return;
  }

  var baseName = path.basename(req.originalUrl || req.url);
  baseName = baseName.split('.')[0];

  function _render(json){
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
      }else{
        detailJson = {};
        ppLogger.write('error', '['+baseName+'.html error] result is empty.');
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '['+baseName+'.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('cp/'+baseName+'.html', res._pp_tpl_data);
  }

  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/task.do?action=taskPackageDetails&taskId='+taskId+'&token=469071fdec0e18f33e41bc1faddee02b',
      'headers': {
        'cookie': req.headers.cookie
      }
    },
    'callback': _render
  });
});



//packagedetail
router.get(['/packagedetail.html'], function(req, res, next) {
  var applyId = req.query.applyId;
  var type = req.query.type;
  var payDateRange = req.query.payDateRange || '';
  if(!applyId || !type){
    res.redirect('mytask.html');
    return;
  }

  var baseName = path.basename(req.originalUrl || req.url);
  baseName = baseName.split('.')[0];

  function _render(json){
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
      }else{
        detailJson = {};
        ppLogger.write('error', '['+baseName+'.html error] result is empty.');
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '['+baseName+'.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res._pp_tpl_data.detail.type = type;
    res.render('cp/'+baseName+'.html', res._pp_tpl_data);
  }

  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/task.do?action=packageAmountDetals&applyId='+applyId+'&type='+type+'&payDateRange='+payDateRange+'&token=469071fdec0e18f33e41bc1faddee02b',
      'headers': {
        'cookie': req.headers.cookie
      }
    },
    'callback': _render
  });
});



//spdetail
router.get(['/spdetail.html'], function(req, res, next) {
  var spid = req.query.sid;
  if(!spid){
    res.redirect('spsearch.html');
    return;
  }

  function _render(json){
    console.log(json);
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
      }else{
        detailJson = {};
        ppLogger.write('error', '[spdetail.html error] result is empty.');
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '[spdetail.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('cp/spdetail.html', res._pp_tpl_data);
  }

  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/user.do?action=selectSpById&spId='+spid+'&token=469071fdec0e18f33e41bc1faddee02b',
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