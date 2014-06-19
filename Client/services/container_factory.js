var app = require("../app");


module.exports = app.factory("ContainerFactory", ['$http', function($http){
	var ContainerFactory = {};

	ContainerFactory.docker = null;
	console.log()

	ContainerFactory.info = function(id){


	}

	ContainerFactory.getContainers = function(){
		if( !ContainerFactory.docker){
			return [];
		}
		return $http
				.get("/api/dockers/"+ ContainerFactory.docker.id + "/containers")
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