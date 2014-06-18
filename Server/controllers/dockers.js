

var express = require('express');
var router = express.Router();
var Docklet = require("../models/docklet.js");



router.get('/', function(req, res){

	Docklet.all( function(err, list){
		if(err){
			console.log("Error listing docker: ", err)
		}else{
			console.log( "Req.url: " + req.url);
			console.log( list);

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
