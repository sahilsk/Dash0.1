

var express = require('express');
var router = express.Router();
var Docklet = require("../models/docklet.js");
var _ = require("underscore");
var async = require("async");

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


router.get("/dockers/:id", function(req,res){
	var resData = { errors: null, data : null};
	Docklet.find(req.params.id, function( err, obj){
			if( err){
				console.log("error caught: " + error);
				resData.errors = error;
				res.send( resData).end();		

			}else{
				resData.data = obj;
				res.send( resData);
			}
		});
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
				res.send( resData);
			}
	});
});


router.get("/dockers/:id/info", function(req, res){

	if(! req.params.id){
		res.send("Invalid request").end();
	}

	var resData = { errors: null, data: null};

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
			
			try{
				docker.info(function(err, info) {
					if(err) {
						console.log("error caught(/dockers/:id/info): " + err);
						resData.errors = err;
						res.send(resData).end();	
						return;
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
			}catch( error){
				resData.errors= error;
				resData.data = null;
				res.send(resData).end();
			}

		}
	})
});


router.get("/dockers/:id/images", function(req, res){

	var id = req.params.id;
	var resData = { error: null, data:null};
	var listOpts = req.query;

	if( typeof(listOpts.all) !== "undefined" )
		listOpts.all = parseInt( listOpts.all);
	if( listOpts.all === 0)
		delete(listOpts.all);

	Docklet.find(id, function( err, obj){
		if( err){
			console.log("Error caught: " + error);
			resData.errors = error;
			res.send( resData ).end();	

		}else{
			var docker = new require('dockerode')({host: "http://"+obj.host, port: obj.port});
			async.parallel(
			{
			    info: function(callback){
			     	docker.info(function(err, info) {
						callback(err, info);
					})
			    },
			    version: function(callback){
			    	docker.version( function(err, version){
			    		callback(err, version);
			    	})
				 },
				 images: function(callback){
				 	docker.listImages(listOpts, function(err, images) {
						callback(err, images);
					});
				 }
			},
			function(err, results) {
			    if(err){
					console.log("Error querying docker :" + err);
					resData.errors = err;
					res.send( resData ).end();
			    }else{
			    	resData.data = { info: results.info, version:  results.version, images: results.images, docker: obj };
			    	resData.data.id = id;
    				resData.data.dockerHost = obj;
			    	res.send( resData ).end();
			    }

			});


		}
	});

});

router.get("/dockers/:id/containers", function(req,res){
	var resData = { errors: null, data:null};

	var listOpts = req.query;

	if( typeof(listOpts.all) !== "undefined" )
		listOpts.all = parseInt( listOpts.all);
	if( listOpts.all === 0)
		delete(listOpts.all);

	if( typeof(listOpts.size) !== "undefined" )
		listOpts.size = parseInt( listOpts.size);
	if( listOpts.size === 0)
		delete(listOpts.size);

	if( typeof(listOpts.limit) !== "undefined" )
		listOpts.limit = parseInt( listOpts.limit);
	
	console.log( listOpts);
	Docklet.find(req.params.id, function( err, dockerHost){
		if( err){
			console.log("Error caught: " + error);
			resData.errors = error;
			res.send( resData ).end();	

		}else{
			var docker = new require('dockerode')
							({host: "http://"+dockerHost.host, port: dockerHost.port});
			docker.listContainers( listOpts, function(err, containers) {
				if(err) {
					console.log("Failed to get container list: ", err);
					resData.errors = err;
					res.send( resData ).end();
					return;
				}else{
					console.log("containers: ", containers);
					resData.data = containers;
					res.send(resData).end();
				}
			});
		}
	})
});



module.exports = router;
