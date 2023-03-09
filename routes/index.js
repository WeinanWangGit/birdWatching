var express = require('express');
var router = express.Router();
const character_controller = require("../controllers/characters");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/insert', character_controller.character_insert);


module.exports = router;
