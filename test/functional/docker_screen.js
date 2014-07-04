var client = require('../config/client').client;
var expect = require('chai').expect;
 

describe("docker screen", function(){
	before( function(done){
        client.init().url("http://localhost:3000", function(err){
        	if(err)
       			done(err);
     
	    	client.getTitle( function(err, title){
		 		console.log(err, title);
		 		expect(title).to.have.string("Login");
		 		//done(); 
		 	});	
			//Add username
			client.addValue("form#loginForm input#username", "admin", function(err){
				if(err){
					console.log(err);
					done(err);
				}
			});
			//Add password
			client.addValue("form#loginForm input#password", "admin123", function(err){
				if(err){
					console.log(err);
					done(err);
				}
			});

			client.submitForm("form#loginForm", function(err){	
				if(err){
					console.log(err);
					done(err);
				}
			 	client.getTitle( function(err, title){
			 		expect(title).to.not.have.string("Login");
			 		done(); 
			 	});				

			});  

 	   });

    
	});

	describe("GET /", function(){
		it('should be logged in', function(done){
		 	client.getTitle( function(err, title){
		 		expect(title).to.not.have.string("Login");
		 		done(); 
		 	});	
		});

	});


    after(function(done) {
        client.end();
        done();
    });

});