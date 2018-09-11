var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  // fs.readFile('test.json', function(err, result){
  //     let parsedjson = JSON.parse(result);
  //     res.json(parsedjson);
  // });
  res.render('index', { title: 'Express' });
});

module.exports = router;
