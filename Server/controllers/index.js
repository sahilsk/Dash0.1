var express = require('express');
var router = express.Router();
var logger = require("../../config/logger");
var Auth = require("./auth");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Dash-v0.1.0' });
});


router.get('/login', function( req, res){
	res.render("login.ejs", { title: "Login | Dash-v0.1.0"});

});

router.post('/login', function( req, res){
	if( Auth.login( req.body ) ){
		req.session.user = req.body;
		logger.info("user authenticated.");
		res.redirect("/");
	}else{
		res.redirect("/login");
		logger.info("Invalid credentials....");
	};

});


router.get('/logout', function(req, res){
	req.session.destroy(function(err) {
		if( err){
			logger.error("Failed to destroy user session");
		}else{
	  		logger.info("Destroyed user session");
	  		logger.info("user logout successfully") ;
			res.redirect('/login');
		}
	})

});


module.exports = router;
