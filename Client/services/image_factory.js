var app = require("../app");


module.exports = app.factory("ImageFactory", ['$http', function($http){
	var ImageFactory = {};

	ImageFactory.docker = null;
	console.log()

	ImageFactory.info = function(id){


	}


	ImageFactory.getImages = function(){
		if( !ImageFactory.docker){
			return [];
		}
		return $http
				.get("/api/dockers/"+ ImageFactory.docker.id + "/images")
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