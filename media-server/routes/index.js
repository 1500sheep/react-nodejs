var express = require('express');
var router = express.Router();

// 여기 안쓴다!

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/img/upload/',function(req,res,next){
 console.log(req.body);
});

module.exports = router;
