var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index' );
});

/* GET home page. */
router.get('/create', function(req, res, next) {
  res.render('create' );
});

/* GET home page. */
router.get('/details', function(req, res, next) {
  res.render('details' );
});





module.exports = router;
