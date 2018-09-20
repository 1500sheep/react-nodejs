var express = require('express');
var router = express.Router();
var request = require('request');

var Client = require('ssh2').Client;
var conn = new Client();
/* GET home page. */
router.get('/', function(req, res, next) {
  // request.get('http://localhost:7402/media/sound/beep/beep.mp3',function(error,response,body){
  //     console.log("response : ",response);
  // })
  res.render('index', { title: 'Express' });
});


module.exports = router;
