'use strict'

var request = require('supertest');
var expect = require("chai").expect;

var server = require('../../server');
var app = require('../../../Server/app');


var hostname = "http://localhost:" + app.get('port');

describe("TEST IMAGE", function(){
	var agent = null;
	var testDockerInstance = null;
	var testImageInstance = null;

	before( function(done){
		console.log("running test on ", hostname);
		agent = request.agent(app);
		
		//login
		agent
		 	.post("/login")
			.send({ username:"admin", password: 'admin123'})
			.expect(302)
			.end( function(err,res){
				agent
					.post('/api/dockers')
					.send({ title:'test-001', host: '54.176.97.94' , port: 4273, healthCheckPath:'/info'})
					.expect(201)
					.end( function(err,res){
						//expect(err).to.be.null;
						var resObj = JSON.parse(res.text);
						expect( resObj).to.have.property('data').that.is.an('object');
						testDockerInstance = resObj.data;
						done();
					});

			})
	});

	describe("/api/dockers/:id/images", function(){

		it("/?", function(done){
			agent
				.get("/api/dockers/" + testDockerInstance.id +"/images")
				.expect(200)
				.end( function(err,res){
					var resObj = JSON.parse(res.text);
					expect( resObj.data).to.be.an('array');
					done();
				});
		})

		it("/?all=1", function(done){
			agent
				.get("/api/dockers/" + testDockerInstance.id +"/images?all=1")
				.expect(200)
				.end( function(err,res){
					var resObj = JSON.parse(res.text);
					expect( resObj.data).to.be.an('array');
					done();
				});	
		})

	})


	describe("/api/dockers/:id/images/:id", function(done){

		before( function(done){
			agent
				.get("/api/dockers/" + testDockerInstance.id +"/images")
				.expect(200)
				.end( function(err,res){
					var resObj = JSON.parse(res.text);
					expect( resObj.data).to.be.an('array');
					testImageInstance = resObj.data[0];
					done();
				});	

		});

		it("/api/dockers/:id/images/:id", function(done){
			agent
				.get("/api/dockers/" + testDockerInstance.id +"/images/"+ testImageInstance.Id)
				.expect(200)
				.end( function(err,res){
					var resObj = JSON.parse(res.text);
					expect(resObj.data).to.have.property('created');
					expect(resObj.data.Size).to.be.equal( testImageInstance.Size);
					done();
				})
		});

		it("/api/dockers/:id/images/:invalidID", function(done){
			agent
				.get("/api/dockers/" + testDockerInstance.id +"/images/"+  "invalid_id")
				.expect(404, done);
		});

	})






	after( function(done){
		//Delete test record
		agent
			.delete('/api/dockers/' + testDockerInstance.id )
			.expect(200); 

		//logout
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
