var client = require('../config/client').client;
var expect = require('chai').expect;

var server = require('../server');
var app = require('../../Server/app');
var hostname = "http://localhost:" + app.get('port');


describe("auth", function(){
	before( function(done){
        client.init(done);
	});

	describe("GET /", function(){
		it('should redirect to /login', function(done){
			client
				.url( hostname + "/dockers")
				.getTitle( function(err, title){
		 			expect(title).to.have.string("Login");
		 			done();
		 		});
		});

		it("should not accept empty fields", function(done){
			client.submitForm("form", function(err){
				if(err){
					console.log(err);
					done(err);
				}
				//Should have html5 validation error
				client.waitFor("input:invalid", 500,  done );

			});
		})

		it("should not allow invalid credentials", function(done){
			//Add username
			client.addValue("form div:nth-child(1) input", "invalid-username", function(err){
				if(err)
					done(err);
			});
			//Add password
			client.addValue("form div:nth-child(2) input", "invalid-password", function(err){
				if(err)
					done(err);
			});

			//Should not have html5 validation error
			client.waitFor("input:invalid", 500,  function(err){
				expect(err).to.not.be.null;
			} );


			client.click("body > div > div > div > div > div.panel-body > form > fieldset > input", function(err, res){
				//console.log(res);
				expect(res).to.have.property("state");
				expect(res.state).to.equal("success");
			 	client.getTitle( function(err, title){
			 		expect(title).to.have.string("Login");
			 		done();
			 	});
			});
		})


	});

	describe("POST /login", function(){

		it("should login with correct credentials", function(done){
			//Add username
			client.addValue("form div:nth-child(1) input", "admin", function(err){
				if(err)
					done(err);
			});
			//Add password
			client.addValue("form div:nth-child(2) input", "admin123", function(err){
				if(err)
					done(err);
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

		})
	});

	describe("GET /logout", function(){

		it("should logout successfully", function(done){
			client.getTitle( function(err, title){
					//console.log( title);
			 		expect(title).to.not.have.string("Login");
					client
						.click("ul.navbar-top-links.navbar-right a.dropdown-toggle", function(err, res){
							client.click("ul.navbar-top-links.navbar-right li:nth-child(4) a", function(err, res){
								if( res.status === "success"){
								 	client.getTitle( function(err, title){
								 		expect(title).to.have.string("Login");
								 		done(); 
								 	});	
								}else{
									done(err);
								}
							}) 
						}); 		
			 });
		})


	})



    after(function(done) {
        client.end();
        done();
    });

});