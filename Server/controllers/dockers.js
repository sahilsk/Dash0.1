

var express = require('express');
var router = express.Router();
var Docklet = require("../models/docklet.js");
var logger = require("../../config/logger")



router.get('/', function(req, res){

	Docklet.all( function(err, list){
		if(err){
			logger.error( err)
		}else{
			logger.debug( "Req.url: " + req.url);
			logger.debug( list);

			res.render('dockers/index', { title:"Dockers"});
		}
	});

})

router.get('/*', function(req, res){
  res.render('dockers/index', { title: 'Docker Dash' });
})

// router.get('/new', function(req, res){
//   res.render('dockers/new', { title: 'New Docker' });
// })







module.exports = router;
