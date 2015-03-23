var express = require('express');
var path = require('path');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require('art-template');
var ppLogger = require('pushpie-logger');
var ppHttp = require('pushpie-http');
var cpRoutes = require('./routes/cp');
var spRoutes = require('./routes/sp');
var weixinRoutes = require('./routes/weixin');
var adminRoutes = require('./routes/admin');
var cacheRoutes = require('./routes/cache');
var session = require('express-session');
var crypto = require('crypto');

ppLogger.write('info', 'pushpie server start');

var app = express();

app.enable('trust proxy');
app.disable('x-powered-by'); //禁止出现在response header中

// view engine setup
template.config('extname', '.html');
template.config('cache', false);
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


//app.use(logger('dev'));
app.use(ppLogger.log4js.connectLogger(ppLogger.normalLogger, {level:ppLogger.log4js.levels.INFO}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*ppLogger.write('fatal', '=======> fatal');
ppLogger.write('error', '=======> error');
ppLogger.write('warn', '=======> warn');
ppLogger.write('info', '=======> info');*/


//设置公用默认值
app.use(['/cp/','/sp/'], function(req, res, next){
    res._pp_tpl_data = {}; //模板数据
    next();
});
//更新缓存
app.use(['/cp/','/sp/'], cacheRoutes);
//验证登陆
app.use(['/cp/','/sp/'], function(req, res, next){
    var cookies = req.cookies;
    if(!cookies.sessionid || !cookies.username || !cookies.usertype){
        ppLogger.write('warn', 'without login cookies.');
        res.redirect('/');
        return;
    }
    ppHttp.get({
        'options': {
          'path': '/appmarket/user.do?action=getUserDetails',
          'headers': {
            'cookie': req.headers.cookie
          }
        },
        'callback': function(json){
            //console.log(json);
            if(json.errorCode == "0"){
                var url = req.originalUrl || req.url;
                if((json.result.type == 0 && url.indexOf('/cp/') != 0) || (json.result.type == 1 && url.indexOf('/sp/') != 0)){
                    res.redirect('/');
                }else{
                    res._pp_tpl_data.userInfo = json.result;
                    //certificate_status 用户资质审核状态 0:未添加资质审核, 1:待审核, 2:审核通过, 3:审核未通过
                    next();
                }
            }else{
                console.log(json);
                res.redirect('/');
                return;
            }
        }
    });
});
app.use('/cp/', cpRoutes);
app.use('/sp/', spRoutes);

app.use('/weixin/', weixinRoutes);

app.use(session({
    name: 'pp_sesskey',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
// app.use('/ppadminpp/', function(req, res, next){
//     console.log(req.session);
//     console.log(req.sessionStore);
//     next();
// });
app.use('/ppadminpp/', adminRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        var errStatus = err.status || 500;
        ppLogger.write('error', '[status='+errStatus+'] [message='+err.message+'] '+err.stack);
        res.status(errStatus);
        var view = errStatus == 404 ? '404' : 'error';
        res.render(view, {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var errStatus = err.status || 500;
    ppLogger.write('error', '[status='+errStatus+'] [message='+err.message+'] '+err.stack);
    res.status(errStatus);
    var view = errStatus == 404 ? '404' : 'error';
    res.render(view, {
        message: err.message,
        error: {}
    });
});


module.exports = app;