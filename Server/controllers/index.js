var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Dash-v0.1.0' });
});

module.exports = router;
