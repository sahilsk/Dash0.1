var request = require('supertest');
var server = require('../server');
var app = require('../../Server/app');

var expect = require("chai").expect;

var hostname = "http://localhost:" + app.get('port');

describe("GET /", function(){
	before( function(done){
		console.log("running test on ", hostname);
		done();
	})

	it("should default redirects to /login", function(done){
		request(app)
			.get("/")
			.expect(302, done);		
	})

	describe("GET /login", function(){


		it("should not login with invalid credentials", function(done){

			request(app)
				.post("/login")
				.send({ username:"admina", password: 'admin123'})
				.expect(302)
				.end( function(err,res){
					expect( res.header.location ).to.be.equal("/login");
					done();
				})	

		})

		it( "should login with valid credentials", function(done){
			request(app)
				.post("/login")
				.send({ username:"admin", password: 'admin123'})
				.expect(302)
				.end( function(err,res){
					expect( res.header.location ).to.be.equal("/");
					done();
				});
		})

	})


	describe("GET /login", function(){
		var agent = null;
		before( function(done){
			 agent = request.agent(app);
			 agent
			 	.post("/login")
				.send({ username:"admin", password: 'admin123'})
				.expect(302,done);
				

		})

		it("should see dashboard", function(done){
			agent
				.get("/")
				.expect(200, done);
		})



	})


	


	after( function(done){
		server.close();
		done();
	})

})
