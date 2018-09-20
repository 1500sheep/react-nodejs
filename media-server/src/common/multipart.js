var multiparty = require('multiparty');
var onFinished = require('on-finished');
var qs = require('qs');
var typeis = require('type-is');

module.exports = multipart;

function multipart(options){
  options = options || {};


  return function multipart(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};
    req.files = req.files || {};

    // ignore GET
    if ('GET' === req.method || 'HEAD' === req.method || 'OPTIONS' === req.method) {
    	return next();
    }
    // check Content-Type
    if (!typeis(req, 'multipart/form-data')) return next();


    // flag as parsed
    req._body = true;

    // parse
    var form = new multiparty.Form(options);
    var data = {};
    var files = {};
    var done = false;

    function ondata(name, val, data){
      if (Array.isArray(data[name])) {
        data[name].push(val);
      } else if (data[name]) {
        data[name] = [data[name], val];
      } else {
        data[name] = val;
      }
    }

    form.on('field', function(name, val){
      ondata(name, val, data);
    });

    form.on('file', function(name, val){
      val.name = val.originalFilename;
      val.type = val.headers['content-type'] || null;
      ondata(name, val, files);
    });

    form.on('error', function(err){
    	console.log(err);
      if (done) return;

      done = true;
      err.status = 400;

      if (!req.readable) return next(err);
      req.resume();
      onFinished(req, function(){
        next(err);
      });
    });

    form.on('close', function() {
      if (done) return;

      done = true;

      try {
        req.body = qs.parse(data, { allowDots: true })
        req.files = qs.parse(files, { allowDots: true })
        next();
      } catch (err) {
        err.status = 400;
        next(err);
      }
    });
    form.parse(req);
  }
};
