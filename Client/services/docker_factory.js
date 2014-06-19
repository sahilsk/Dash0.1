var app = require("../app");


module.exports = app.factory("DockerFactory", ['$http', function($http){
	var DockerFactory = {};
	DockerFactory.dockers = [];

	DockerFactory.getDockers = function(){
		return $http
			.get("/api/dockers/list" )
			.success( function(data){
					if(data.status != 200 ){
						console.log( data.errors);
					}else{
						//console.log( data);
						return data;
					}	
			})
			.error( function(){
				alert("something goes wrong while retreiving docker list");
			});

	}

	DockerFactory.find = function(id){
		return $http
				.get('/api/dockers/'+id)
				.success( function(res){
					if( res.errors )
						return null;
					else
						return res.data
				})
				.error( function(err){
				 	console.log("Error :", err);
				})

	}


	DockerFactory.save = function( docker){
		return $http
			.post("/api/dockers", docker )
			.success( function(res){
					return res;					
				}
			)	;
	}

	DockerFactory.delete = function( id){
		console.log("sendind delete request");
		return $http
			.delete("/api/dockers/"+id)
			.success( function( res){
				console.log("Deleted: ", res);
				return res;
			})
			.error( function(err){
				console.log("Error deleting docker: ", err);
			});

	}


	DockerFactory.info = function( id){
		return $http
				.get('/api/dockers/'+id+"/info")
				.success( function(res){
					return res;
				})
				.error( function(err){
				 	console.log("Error :", err);
				})
	}

	DockerFactory.getImages = function( id){
			return $http
					.get('/api/dockers/' + id + '/images')

	}


	
	return DockerFactory;

}] );