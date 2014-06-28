var app = require("../app");
var _ = require("underscore");

module.exports = app.factory("ImageFactory", ['$http', function($http){
	var ImageFactory = {};

	ImageFactory.docker = null;
	console.log()

	ImageFactory.options = {
		all: 0
	}

	ImageFactory.getImages = function(opts){
		if( !ImageFactory.docker){
			return [];
		}

		opts = _.defaults(opts, ImageFactory.options);
		return $http({	
			method:"GET", url: "/api/dockers/"+ ImageFactory.docker.id + "/images", params: opts }
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

	ImageFactory.inspectImage = function( id){
		if( !id){
			return {};
		}
		return $http({	
				method:"GET", url: "/api/dockers/"+ ImageFactory.docker.id + "/images/" + id }
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
	
	return ImageFactory;

}] );