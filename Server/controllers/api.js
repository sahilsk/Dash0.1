

var express = require('express');
var router = express.Router();
var Docklet = require("../models/docklet.js");

router.get('/dockers/list', function(req, res) {
	var data = {};
	Docklet.all( function(err, list){
		if(err){
			console.log("Error listing docker: ", err)
			res.json(err);
			data.status = 500;
			data.errors =  [].push(err);
		}else{
			data.status = 200;
			data.rows =  list;
			console.log( data);

			res.json(data);
		}
	});
});


router.post('/dockers', function( req, res){
	console.log('Saving docker: ', req.body);
	var resData = { errors: null, data:null};
	try{
		Docklet.save(req.body, function(err, docklet){
			if(err){
				resData.errors = err;
			}else
				{
					console.log("Docklet created successfully");
					resData.data =docklet;
				}
			res.send(resData).end();
		})
	} catch(err){
		console.log("Error: ", err);
		resData.errors = err;
		res.send( resData ).end();
	}	

});


router.delete("/dockers/:id", function(req, res){
	console.log("Deleting docker: ", req.params.id);
	var resData = { errors: null, data:null};
	Docklet.destroy(req.params.id, function(err){
			if(!err){
				res.send( resData ).end();
			}else{
				resData.errors = err;
				console.log(err);
			}
			
	});

});


router.get("/dockers/:id/info", function(req, res){

	if(! req.params.id){
		res.send("Invalid request").end();
	}

	var resData = { error: null, data:null};

	Docklet.find(req.params.id, function( err, obj){
		if( err){
			console.log("Error finding docker: " + error);
			resData.errors = error;
			res.send(resData).end();
			return;		

		}else{
			console.log("Docker found: ", obj);
			var docker = new require('dockerode')({host: "http://"+obj.host, port: obj.port});
			var healthCheck = require("../lib/healthCheck");
			
			docker.info(function(err, info) {
				if(err) {
					console.log("error caught: " + err);
					resData.errors = err;
					res.send(resData).end();	
				}else{
					console.log("info: ", info);
					resData.data = info;
					healthCheck( "http://"+obj.host+":" + obj.port+ obj.healthCheckPath , function(error, isOK){
						resData.data.HealthStatus = isOK;
						console.log( resData);
						res.send(resData).end();			
					} );					
				}	

			});		

		}
	})
});


module.exports = router;
