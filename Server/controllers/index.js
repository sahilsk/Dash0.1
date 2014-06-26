var express = require('express');
var router = express.Router();

var Auth = require("./auth");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Dash-v0.1.0' });
});


router.get('/login', function( req, res){
	res.render("login.ejs", { title: "Login | Dash-v0.1.0"});

});

router.post('/login', function( req, res){
	console.log("authenticating....");
	if( Auth.login( req.body ) ){
		req.session.user = req.body;
		res.redirect("/");
	}else{
		res.redirect("/login");
	};

});


router.get('/logout', function(req, res){
	req.session.destroy(function(err) {
		if( err){
			console.log("Failed to destroy user session");
		}else{
	  		console.log("Destroyed user session")
	  		console.log("user logout successfully") ;
			res.redirect('/login');
		}
	})

});


module.exports = router;
