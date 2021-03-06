

var express = require('express');
var router = express.Router();
var Docklet = require("../models/docklet.js");
var _ = require("underscore");
var async = require("async");
var logger = require("../../config/logger");


var getDockers = function(req, res) {
					var data = {};
					Docklet.all( function(err, list){
						if(err){
							logger.error(err);
							res.json(err);
							data.status = 500;
							data.errors =  [].push(err);
						}else{
							data.status = 200;
							data.rows =  list;
							logger.debug(data);
							res.json(data);
						}
					});
				}

router.get('/dockers',getDockers);

router.get('/dockers/list', getDockers);

router.post('/dockers', function( req, res){
	logger.info('Saving docker: ', req.body);
	res.type('json');
	var resData = { errors: null, data: null};

	Docklet.save(req.body, function(err, docklet){
		if(err){
			resData.errors = err;
			res.send(406, resData).end();
			return;
		}else{
			logger.info("Docklet created successfully");
			resData.data = docklet;
			res.send(201,resData).end();
			return;
		}
		
	});

});

router.get("/dockers/:id", function(req,res){
	res.type('json');

	var resData = { errors: null, data: null};
	if(! req.params.id){
		resData.errors = "Invalid request";
		res.send(resData).end();
	}

	Docklet.find(req.params.id, function( err, obj){
			if( err){
				logger.error(error);
				resData.errors = error;
				res.send( resData).end();		

			}else{
				resData.data = obj;
				res.send( resData);
			}
	});
});

router.delete("/dockers/:id", function(req, res){
	logger.info("Deleting docker: ", req.params.id);
	var resData = { errors: null, data:null};
	Docklet.destroy(req.params.id, function(err){
			if(!err){
				res.send( resData ).end();
			}else{
				resData.errors = err;
				logger.error(err);
				res.send( resData);
			}
	});
});

router.get("/dockers/:id/info", function(req, res){

	var resData = { errors: null, data: null};
	if(! req.params.id){
		resData.errors = "Invalid request";
		res.send(resData).end();
		return;
	}
	Docklet.find(req.params.id, function( err, obj){
		res.type('json');
		if( err){
			logger.error( err);
			resData.errors = err;
			res.send(resData).end();
			return;		

		}else{
			logger.info("Docker found: ", obj);
			var docker = new require('dockerode')({host: "http://"+obj.host, port: obj.port});
			var healthCheck = require("../lib/healthCheck");


			try{
				docker.info(function(err, info) {
					if(err) {
						logger.error(err);
						resData.errors = err;
						res.send(resData).end();	
						return;
					}else{
						logger.info(info);
						resData.data = info;
						healthCheck("http://"+obj.host+":" + obj.port+ obj.healthCheckPath , function(error, isOK){
							resData.data.HealthStatus = isOK;
							res.type("json");
							res.send( resData);
							return;	
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

router.get("/dockers/:id/infoWithVersion", function(req, res){
	var resData = { errors: null, data: null};
	if(! req.params.id){
		resData.errors = "Invalid request";
		res.send(resData).end();
		return;
	}

	var resData = { errors: null, data: null};

	Docklet.find(req.params.id, function( err, obj){
		if( err){
			logger.error(err);
			resData.errors = error;
			res.send(resData).end();
			return;

		}else{
			logger.info( obj);
			var docker = new require('dockerode')({host: "http://"+obj.host, port: obj.port});
			var healthCheck = require("../lib/healthCheck");
			
			async.parallel(
			{
			    info: function(callback){
			     	docker.info(function(err, info) {
						if(err) {
							callback(err, info);
						}else{
							logger.info(info);
							resData.data = info;
							healthCheck( "http://"+obj.host+":" + obj.port+ obj.healthCheckPath , function(error, isOK){
								info.HealthStatus = isOK;
								callback(null, info);
							} );					
						}			     		
					})
			    },
			    version: function(callback){
			    	docker.version( function(err, version){
			    		callback(err, version);
			    	})
				 }
			},
			function(err, results) {
			    if(err){
					logger.error( err);
					resData.errors = err;
					res.send( resData ).end();
			    }else{
			    	resData.data = { info: results.info, version:  results.version };
			    	res.send( resData ).end();
			    }

			});
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
			logger.error( err);
			resData.errors = err;
			res.send( resData ).end();	

		}else{
			var docker = new require('dockerode')({host: "http://"+obj.host, port: obj.port});

		 	docker.listImages(listOpts, function(err, images) {
				if(err){
					logger.error( err);
					resData.errors = err;
					res.send( resData ).end();
					return;
			    }else{
			    	logger.info( images);
			    	resData.data = images;
			    	res.send( resData ).end();
			    	return;
			    };
			});


		}
	});
});

router.get("/dockers/:id/images/:imageId", function(req, res){

	var id = req.params.id;
	var imageId = req.params.imageId;
	var resData = { errors: null, data:null};

	Docklet.find(id, function( err, dockerHost){
		if( err){
			logger.error(err);
			resData.errors = err;
			res.send( resData ).end();	

		}else{
			var docker = new require('dockerode')({host: "http://"+dockerHost.host, port: dockerHost.port});

			var image = docker.getImage( imageId);
			image.inspect( function(err, data ){
				if(err){
					resData.errors = err.reason;
					res.send( err.statusCode, resData ).end();	
				}else{
					resData.data = data;
					logger.info( resData);
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
	
	logger.info(listOpts);
	Docklet.find(req.params.id, function( err, dockerHost){
		if( err){
			logger.error(err);
			resData.errors = err;
			res.send( resData ).end();	

		}else{
			var docker = new require('dockerode')
							({host: "http://"+dockerHost.host, port: dockerHost.port});
			docker.listContainers( listOpts, function(err, containers) {
				if(err) {
					logger.error("Failed to get container list: %s", err);
					resData.errors = err;
					res.send( resData ).end();
					return;
				}else{
					logger.debug("containers: %j", containers);
					resData.data = containers;
					res.send(resData).end();
				}
			});
		}
	})
});

router.get("/dockers/:id/containers/:containerId", function(req, res){

	var id = req.params.id;
	var containerId = req.params.containerId;
	var resData = { errors: null, data:null};

	Docklet.find(id, function( err, dockerHost){
		if( err){
			logger.error( err);
			resData.errors = err;
			res.send( resData ).end();	

		}else{
			var docker = new require('dockerode')({host: "http://"+dockerHost.host, port: dockerHost.port});

			var container = docker.getContainer( containerId);
			container.inspect( function(err, data ){
				if(err){
					resData.errors = err.reason;
					res.send( err.statusCode, resData ).end();	
				}else{
					resData.data = data;
					logger.info( resData);
					res.send( resData ).end();	
				}
			});

		}
	});
});

router.get( "/dockers/:id/containers/:containerId/top", function(req, res){
	var containerId = req.params.containerId;
	var resData = { errors: null, data:null};
	var id = req.params.id;

	Docklet.find( id, function( err, dockerHost){
		if( err){
			logger.error(err);
			resData.errors = err;
			res.send(500, resData ).end();	

		}else{
			var docker = new require('dockerode')({host: "http://"+dockerHost.host, port: dockerHost.port});
			var container = docker.getContainer( containerId);
			container.top( function(err, processes){
				if(err) {
					logger.error( err);
					resData.errors = err.reason;
					res.send(err.statusCode, resData ).end();	
				}else{
					logger.debug("processes: %j", processes);
					resData.data = processes;
					res.send(200, resData ).end();	
				}
			});
		}
	});
})

module.exports = router;
