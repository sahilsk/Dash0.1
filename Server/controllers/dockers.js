var express = require('express');
var router = express.Router();

/* GET Docker list. */
router.get('/', function(req, res) {
	res.redirect("/dockers/list");
});

router.get('/list', function(req, res){
  res.render('dockers/list', { title: 'Docker List' });
})

router.get('/new', function(req, res){
  res.render('dockers/new', { title: 'New Docker' });
})






module.exports = router;
