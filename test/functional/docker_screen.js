var client = require('../config/client').client;
var expect = require('chai').expect;
 

describe("docker screen", function(){
	before( function(done){
        client.init().url("http://localhost:3000/", function(err){
        	expect(err).to.be.null;
        });;

        //Resize browser to render Desktop layout
        client	
        	.windowHandleSize({width: 1324, height: 764} );
     
	    	client.getTitle( function(err, title){
		 		if( title.indexOf("Login") == -1 ){
		 			done(); 
		 		}
		 	});	
		//Fill login form
		client
			.addValue("form#loginForm input#username", "admin", function(err){
				if(err){
					console.log(err);
					done(err);
				} 
			})
			.addValue("form#loginForm input#password", "admin123", function(err){
				expect(err).to.be.null;
			})
		//submit login form
			.submitForm("form#loginForm", function(err){	
				expect(err).to.be.null;
			})
			.getTitle( function(err, title){
			 	expect(title).to.not.have.string("Login");
			 	
			 }) 
			 .call(done);


	});

	describe("GET /", function(){
		it('should be logged in', function(done){
		 	client.getTitle( function(err, title){
		 		console.log("Page title: ", title);
		 		expect(title).to.not.have.string("Login");
		 		done(); 
		 	});	
		});
 
		it('should see docker list table', function(done){
			client
				.click("#side-menu > li:nth-child(2) > a", function(err, res){
					expect(err).to.be.null;
				})
				.click("#side-menu > li.active > ul > li:nth-child(1) > a", function(err,res){
					expect(err).to.be.null;
				})
				.waitFor('table#dockerHostTable', 3000, function(err, res){
		  			expect(err).to.be.null;
				})
				.elements('table#dockerHostTable tbody tr', function(err, res){
					expect( res.value.length).to.not.equal(0);
				})
				.call(done);
		});

		it('should show docker host stats', function(done){

			client.click("#dockerHostTable  tbody > tr > td:nth-child(9)  button.btn.btn-default.btn-sm", function(err,res){
				expect(err).to.be.null;
			})
			.waitFor("#docker-stat", 5000, function(err, res){
				expect(err).to.be.null;
			})
			.pause(3000)
			.call(done);
		})

		it('should show container list', function(done){
			client
				.click("#dockerHostTable  tbody > tr > td:nth-child(9)  button.btn.btn-info.dropdown-toggle.btn-sm", function(err,res){
					expect(err).to.be.null;
				})
				.click('#dockerHostTable  tbody > tr  td:nth-child(9)   ul  li:nth-child(1)  a', function(err,res){
					expect(err).to.be.null;
				})
				.waitFor("#containerTableWrapper table", 10000, function(err){
					expect(err).to.be.null;
				})
				.call(done);

		});

		it('should get container info', function(done){
			client
				.waitFor( "#containerTableWrapper table tbody  tr:nth-child(2)  td:nth-child(2) >  a", 10000, function(err,res){
					expect(err).to.be.null;
				})
				.pause(10000)
				.click("#containerTableWrapper table tbody  tr:nth-child(2)  td:nth-child(2) > a", function(err){
					expect(err).to.be.null;
				})			
				.waitFor("#launchInspectWindow", 3000, function(err){
					expect(err).to.be.null;
				})
				.pause(5000)
				.isVisible("#launchInspectWindow", function(err, value){
					expect(err).to.be.null;
					expect(value).to.be.true;
				})
				.buttonClick("#launchInspectWindow > div > div > div.modal-header > button", function(err, value){
					expect(err).to.be.null;
				})
				.call(done);

		});


		it('should show image list', function(done){
			client
				.click("#dockerHostTable  tbody > tr > td:nth-child(9)  button.btn.btn-info.dropdown-toggle.btn-sm", function(err,res){
					expect(err).to.be.null;
				})
				.click('#dockerHostTable  tbody > tr td:nth-child(9) ul li:nth-child(2) a', function(err,res){
					expect(err).to.be.null;
				})
				.waitFor("#imageTableWrapper table", 10000, function(err){
					expect(err).to.be.null;
				})
				.call(done);
		});



	});


    after(function(done) {
        client.end().pause(30000);
        done();
    });

});