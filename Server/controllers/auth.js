var config = require("config");

var auth = {};

auth.login = function( user){
	return ( user.username === config.auth.username && user.password === config.auth.password );
}


module.exports = auth;
