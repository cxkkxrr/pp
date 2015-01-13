var express = require('express');
var path = require('path');
var router = express.Router();
//var ppHttp = require('pushpie-http');




router.get('/index', function(req, res, next) {
  console.log(req.query);
  next();
});

module.exports = router;