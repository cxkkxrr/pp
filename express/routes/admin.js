var express = require('express');
var path = require('path');
var router = express.Router();
var ppHttp = require('pushpie-http');
var ppLogger = require('pushpie-logger');
var fs = require('fs');
var exists = fs.existsSync || path.existsSync;
var ppCache = require('pushpie-cache');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

function md5(v){
  return crypto.createHash('md5').update(v).digest('hex');
}
//首页
/*router.get(['/','/index.html'], function(req, res, next) {
  res.render('ppadminpp/index.html', res._pp_tpl_data);
});*/




//登录
router.post('/login', function(req, res, next) {
  //0c9fc83dffb41b2c2dc8259ba14791c9 --> HKh@knF;oc44$9i$
  if(req.body.userName === 'pushpie' && req.body.password === '0c9fc83dffb41b2c2dc8259ba14791c9'){
    /*var transporter = nodemailer.createTransport({
      host: 'smtp.exmail.qq.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'system@pushpie.com',
        pass: 'sAgFggFD$^*&45kf2'
      }
    });
    transporter.sendMail({
        from: 'system@pushpie.com',
        to: 'admin@pushpie.com',
        subject: '登录后台 - ' + req.body.userName + ' - ' + req.ip,
        text: ''
    });*/
    res.setHeader("Set-Cookie", ['pp_askey='+md5(req.sessionID)+';path=/;']);
    res.redirect('main.html');
  }else{
    res.redirect('login.html');
  }
  return;
});

//退出
function doLogout(req, res){
  req.session.destroy();
  var today = new Date();
  var time = today.getTime() - 999000;
  var new_date = new Date(time);
  var expiresDate = new_date.toGMTString();
  res.setHeader("Set-Cookie", ['pp_askey=;path=/;expires='+expiresDate+';']);
  res.redirect('login.html');
}
router.get('/logout', function(req, res, next) {
  doLogout(req, res);
  return;
});


//退出所有
router.get('/logoutAll', function(req, res, next) {
  req.sessionStore.clear();
  res.writeHeader(200, {"Content-Type": "text/html"});
  res.end('ok');
});


//登录页面
router.get(['/', '/login.html'], function(req, res, next) {
  res.render('admin/login.html', {});
});


router.get('*', function(req, res, next) {
  //console.log(md5(req.sessionID));
  //console.log(req.cookies.pp_askey);
  if(req.session && (req.cookies.pp_askey === md5(req.sessionID))){
    if(!req.session.time){ //session第一次创建
        req.session.ip = req.ip;
        req.session.time = (new Date()).getTime();
        next();
    }else{
        if((req.session.time + 3600000) < (new Date()).getTime()){ //1小时过期
            doLogout(req, res);
            return;
        }else{ //没过期
            req.session.time = (new Date()).getTime();
            next();
        }
    }
  }else{
    doLogout(req, res);
    return;
  }
});

//其他页面
router.get(/^\/[a-zA-Z0-9]+.html$/, function(req, res, next) {
  //console.log('==========others========');
  var baseName = path.basename(req.originalUrl || req.url);
  baseName = baseName.split('.')[0];
  var relativePath = 'admin/'+baseName+'.html';
  res.render(relativePath, {}, function(err, str){
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