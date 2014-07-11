'use strict'

var request = require('supertest');
var server = require('../../server');
var app = require('../../../Server/app');

var expect = require("chai").expect;

var hostname = "http://localhost:" + app.get('port');

describe("TEST DOCKERS", function(){
	var agent = null;
	var testDockerInstance = null;

	before( function(done){
		console.log("running test on ", hostname);
		agent = request.agent(app);
		 agent
		 	.post("/login")
			.send({ username:"admin", password: 'admin123'})
			.expect(302,done);
	})


	it("should fetch dockers list", function(done){
		agent
			.get('/api/dockers')
			.expect(200)
			.end(function(err,res){	
				var resObj = JSON.parse( res.text);
				expect(resObj ).to.have.property('rows')
				.that.is.an('array');
				done();
			})

	});

	it("should not accept invalid parameters", function(done){
		agent
			.post('/api/dockers')
			.send({ title:'test-001', hostname: '54.176.97.94' , port: 4273, healthCheckPath:'/info'})
			.expect(406, done);
	})


	it("should not accept valid parameters but with invalid values", function(done){
		agent
			.post('/api/dockers')
			.send({ title:'test-001', host: 'sonu was here' , port: '4273', healthCheckPath:'/info'})
			.expect(406, done);
	})

	it("should accept valid parameters with valid values", function(done){
		agent
			.post('/api/dockers')
			.send({ title:'test-001', host: '54.176.97.94' , port: 4273, healthCheckPath:'/info'})
			.expect(201)
			.end( function(err,res){
				expect(err).to.be.null;
				var resObj = JSON.parse(res.text);
				expect( resObj).to.have.property('data').that.is.an('object');
				testDockerInstance = resObj.data;
				done();
			});
	});


	it("/api/dockers/:id", function(done){
		agent
			.get("/api/dockers/" + testDockerInstance.id)
			.expect(200)
			.end( function(err,res){
				var resObj = JSON.parse(res.text);
				expect(resObj.data).to.have.property('title');
				expect(resObj.data.title).to.be.equal( testDockerInstance.title);
				done();
			});
	} )	

	it("should delete added docker", function(done){
		agent
			.delete('/api/dockers/' + testDockerInstance.id )
			.expect(200, done); 
	});




	after( function(done){
		agent
			.get('/logout')
			.expect(302)
			.end( function(err,res){
				expect( res.header.location ).to.be.equal("/login");
				agent = null;
				//server.close();
				done();
			});

	});

})
