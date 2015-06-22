var express = require('express');
var path = require('path');
var router = express.Router();
var ppHttp = require('pushpie-http');
var ppLogger = require('pushpie-logger');
var fs = require('fs');
var exists = fs.existsSync || path.existsSync;
//var ppCache = require('pushpie-cache');

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
  function _render(json){
    //console.log(json);
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
      }else{
        detailJson = {};
        ppLogger.write('error', '[sp/index.html error] result is empty.');
        //res.redirect('cpsearch.html');
        //return;
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '[sp/index.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('sp/index.html', res._pp_tpl_data);
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


//cpdetail
router.get(['/cpdetail.html'], function(req, res, next) {
  var taskId = req.query.taskId;
  if(!taskId){
    res.redirect('cpsearch.html');
    return;
  }

  function _render(json){
    var detailJson;
    if(json.errorCode == "0"){
      if(!!json.result){
        detailJson = json.result;
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
      'path': '/appmarket/task.do?action=showTaskById&id='+taskId+'&token=469071fdec0e18f33e41bc1faddee02b',
      'headers': {
        'cookie': req.headers.cookie
      }
    },
    'callback': _render
  });
});




//taskdetail evaluation
router.get(['/taskdetail.html', '/evaluation.html'], function(req, res, next) {
  var applyId = req.query.applyId;
  var type = req.query.type;
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
        //res.redirect('mytask.html');
        //return;
      }
    }else{
      detailJson = {};
      ppLogger.write('error', '['+baseName+'.html error] ' + JSON.stringify(json));
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('sp/'+baseName+'.html', res._pp_tpl_data);
  }

  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/task.do?action=getSpExpandAmountDetail&applyId='+applyId+'&type='+type+'&token=469071fdec0e18f33e41bc1faddee02b',
      'headers': {
        'cookie': req.headers.cookie
      }
    },
    'callback': _render
  });
});


//qualification
router.get(['/qualification.html','/qualificationreview.html'], function(req, res, next) {

  var baseName = path.basename(req.originalUrl || req.url);
  baseName = baseName.split('.')[0];

  var action = req.query.action;
  res._pp_tpl_data.pageAction = action;
  if(baseName == 'qualificationreview' && action != 'edit'){
    res._pp_tpl_data.detail = {};
    res._pp_tpl_data.detail.productLabelIdList = [];
    res._pp_tpl_data.detail.expandTypeIdList = [];
    res.render('sp/'+baseName+'.html', res._pp_tpl_data);
    return;
  }

  function _render(json){
    //console.log(json);
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

    var productLabelList = [];
    var productLabelIdList = [];
    if(!!detailJson.productLabelList){
      for(var i = 0; i < detailJson.productLabelList.length; i++){
        productLabelList.push(detailJson.productLabelList[i].name);
        productLabelIdList.push(detailJson.productLabelList[i].id);
      }
    }
    detailJson.productLabel = productLabelList.join('、');
    detailJson.productLabelIdList = productLabelIdList;

    var expandTypeList = [];
    var expandTypeIdList = [];
    if(!!detailJson.expandTypeList){
      for(var i = 0; i < detailJson.expandTypeList.length; i++){
        expandTypeList.push(detailJson.expandTypeList[i].name);
        expandTypeIdList.push(detailJson.expandTypeList[i].id);
      }
    }
    detailJson.expandType = expandTypeList.join('、');
    detailJson.expandTypeIdList = expandTypeIdList;

    if(detailJson.spOsAndProductType != undefined){
      if(detailJson.spOsAndProductType.productType != undefined){
        detailJson.productType = detailJson.spOsAndProductType.productType
      }
      if(detailJson.spOsAndProductType.os != undefined){
        detailJson.os = detailJson.spOsAndProductType.os
      }
    }

    res._pp_tpl_data.detail = detailJson;
    res.render('sp/'+baseName+'.html', res._pp_tpl_data);
  }
  ppHttp.get({
    'options': {
      'host' : 'localhost',
      'port': '8080',
      'path': '/appmarket/user.do?action=showCertificate&token=469071fdec0e18f33e41bc1faddee02b',
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
  //res._pp_tpl_data.formLabel = ppCache.label;
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