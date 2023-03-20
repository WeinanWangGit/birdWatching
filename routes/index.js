var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index' );
});

/**
 * @swagger
 * /create:
 *   get:
 *     summary: create a sighting
 *     responses:
 *       200:
 *         description: save in mongodb
 */
router.get('/create', function(req, res, next) {
  res.render('create' );
});

/* GET home page. */
router.get('/details', function(req, res, next) {
  res.render('details' );
});





module.exports = router;
