var app = require("../app");
var _ = require("underscore");


module.exports = app.factory("ContainerFactory", ['$http', function($http){
	var ContainerFactory = {};
	ContainerFactory.containers = [];

	ContainerFactory.options = {
		all: 0,
		size:0,
		limit: 100
	}

	ContainerFactory.docker = null;
	console.log()

	ContainerFactory.info = function(id){
	}

	ContainerFactory.getContainers = function(opts){
		if( !ContainerFactory.docker){
			return [];
		}
		opts = _.defaults(opts, ContainerFactory.options);
		return $http({	
				method:"GET", url: "/api/dockers/"+ ContainerFactory.docker.id + "/containers" , params: opts}
				)
				.success( function(res){
					if( res.errors ){
						console.log( "Error:" , res.errors);
						return res;
					}else{
						//console.log("Containers: ", res.data);
						return res.data;
					}
				});
	}

	ContainerFactory.inspectContainer = function( id){
		if( !id){
			return {};
		}
		return $http({	
				method:"GET", url: "/api/dockers/"+ ContainerFactory.docker.id + "/containers/" + id }
				)
				.success( function(res){
					if( res.errors ){
						console.log( "Error:" , res.errors);
						return res;
					}else{
						console.log("Images: ", res.data);
						return res.data;
					}
				});

	}

	
	return ContainerFactory;

}] );