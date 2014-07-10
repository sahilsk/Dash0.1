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
			.call(done);
		})

		it('should show container list', function(done){
			client
				.click("#dockerHostTable  tbody > tr > td:nth-child(9)  button.btn.btn-info.dropdown-toggle.btn-sm", function(err,res){
					expect(err).to.be.null;
				})
				.waitForVisible("#dockerHostTable  tbody > tr  td:nth-child(9)   ul  li:nth-child(1)  a", 10000 )
				.click('#dockerHostTable  tbody > tr  td:nth-child(9)   ul  li:nth-child(1)  a', function(err,res){
					expect(err).to.be.null;
				})
				.waitFor("#containerTableWrapper table", 10000, function(err){
					expect(err).to.be.null;
				})
				.scroll("#containerTableWrapper table", function(err){
					expect(err).to.be.null;
				})
				.call(done);
		});

		it('should get container info', function(done){
			client
				.waitFor("#containerTableWrapper table tbody  tr:nth-child(2)  td:nth-child(2) >  a", 10000, function(err,res){
					expect(err).to.be.null;
				})
				.click("#containerTableWrapper table  tbody  tr:nth-child(2) td:nth-child(2) > a", function(err,res){
				 		expect(err).to.be.null;
				})
				.waitForVisible("#launchInspectWindow", 10000)
				.buttonClick("#launchInspectWindow > div > div > div.modal-header > button", function(err){
					expect(err).to.be.null;
				})
				.pause(500)
				.call(done);
		});

		it('should get process list running inside container', function(done){
			client
				.click('#containerTableWrapper  tbody  tr:nth-child(2)  td:nth-child(11) a', function(err,res){
					expect(err).to.be.null;
				})
				.waitFor('#processesTableWrapper', 5000)
				.scroll('#processesTableWrapper')
				.call(done);
		})

		it('should show image list', function(done){
			client
				.scroll("#dockerHostTable")
				.pause(2000)
				.waitForVisible("#dockerHostTable  tbody > tr > td:nth-child(9)  button.btn.btn-info.dropdown-toggle.btn-sm", 10000)
				.click("#dockerHostTable  tbody > tr > td:nth-child(9)  button.btn.btn-info.dropdown-toggle.btn-sm", function(err,res){
					expect(err).to.be.null;
				})
				.click('#dockerHostTable  tbody > tr td:nth-child(9) ul li:nth-child(2) a', function(err,res){
					expect(err).to.be.null;
				})
				.waitFor("#imageTableWrapper table", 10000, function(err){
					expect(err).to.be.null;
				})
				.scroll("#imageTableWrapper table", function(err){
					expect(err).to.be.null;
				})
				.call(done);
		});

		it('should get image info', function(done){
			client
				.waitFor("#imageTableWrapper table tbody  tr:nth-child(2)  td:nth-child(2) >  a", 10000, function(err,res){
					expect(err).to.be.null;
				})
				.click("#imageTableWrapper table  tbody  tr:nth-child(2) td:nth-child(2) > a", function(err,res){
				 		expect(err).to.be.null;
				})
				.waitForVisible("#launchInspectWindow", 10000)
				.pause(1000)
				.buttonClick("#launchInspectWindow > div > div > div.modal-header > button", function(err){
					expect(err).to.be.null;
				})
				.pause(500)
				.call(done);
		});

		it('should logout', function(done){
			client
				.click('#wrapper > nav > ul > li > a', function(err, res){
					expect(err).to.be.null;
				})
				.waitForVisible('#wrapper > nav > ul > li > ul > li:nth-child(4) > a', 2000)
				.click('#wrapper > nav > ul > li > ul > li:nth-child(4) > a', function(err,res){
					expect(err).to.be.null;
				})
				.getTitle(function(err,title){
					expect(title).to.have.string("Login");
				})
				.call(done);

		});


	});


    after(function(done) {
        client.endAll();
        done();
    });
});