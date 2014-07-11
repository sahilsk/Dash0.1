'use strict'

var request = require('supertest');
var server = require('../../server');
var app = require('../../../Server/app');

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

	it("should not allow unauthenticated api access", function(done){
		request(app)
			.get("/api/dockers")
			.expect(302)
			.end( function(err,res){
				expect( res.header.location ).to.be.equal("/login");
				done();
			})
	})
	describe("ON /login", function(){
		it("should not login with invalid credentials", function(done){
			request(app)
				.post("/login")
				.send({ username:"admina", password: 'admin123'})
				.expect(302)
				.end( function(err,res){
					expect( res.header.location ).to.be.equal("/login");
					done();
				});
		})

		it( "should login with valid credentials", function(){
			request(app)
				.post("/login")
				.send({ username:"admin", password: 'admin123'})
				.expect(302)
				.end( function(err,res){
					expect( res.header.location ).to.be.equal("/");
				});
		})

	})


	describe("AFTER Login /", function(){
		var agent = null;
		before( function(done){
			 agent = request.agent(app);
			 agent
			 	.post("/login")
				.send({ username:"admin", password: 'admin123'})
				.expect(302,done);

		})
		it("should see dashboard", function(){
			agent
				.get("/")
				.expect(200); 
		})
		it("should allow api access", function(done){
			agent
				.get("/api/dockers")
				.expect(200, done);
				
		})		

		it("should logout successfully", function(done){
			agent
				.get('/logout')
				.expect(302)
				.end( function(err,res){
					expect( res.header.location ).to.be.equal("/login");
					done();
				})
		})
		it("should not allow api access after logout", function(done){
			agent
				.get("/api/dockers")
				.expect(302)
				.end( function(err,res){
					expect( res.header.location ).to.be.equal("/login");
					done();
				})
		})

		after(function(){
			agent = null;
		})
	})


	after( function(done){
		//server.close();
		done();
	})

})
