var request = require('request');
var logger = require("../../config/logger");

var options = {
    headers: {
        'User-Agent': 'request'
    },
    timeout :3000
};


module.exports= function( healthCheckURL, cb){

	options.url = healthCheckURL;
	logger.info("::::::::::::::: checking health: ", healthCheckURL)
	request( options, function(error, res, body){
	    if (!error && res.statusCode == 200) {
	    	// body.text.includes("OK")
	    	logger.info("-----------Service is healthy-------------")
	    	cb(null, true);
	    	return;
	    }else{
	    	logger.error("Error checking health: ", error);
	    	cb(error, false)
	    	return;
	    }

	})

}