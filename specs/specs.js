require('dotenv').config()

var request 			= require('supertest'),
	chai				= require('chai'),
	app					= require('../server/server.js'),
	assert  			= chai.assert,
	expect  			= chai.expect,
	should  			= chai.should(),
	db                  = require("../api/v1/db.js"),
    organizationModel   = db.organizationModel,
    parentModel         = db.parentModel;

describe('#organizationRoutesSpecs', function() {
	var data;

	beforeEach(function() {
		organizationModel.destroy({
		  where: {},
		  truncate: true
		})

		parentModel.destroy({
		  where: {},
		  truncate: true
		})
	})

	afterEach(function() {
		organizationModel.destroy({
		  where: {},
		  truncate: true
		})

		parentModel.destroy({
		  where: {},
		  truncate: true
		})
	})

	data = {
		"org_name":"Paradise island",
		"daughters":[
			{
				"org_name":"Banana tree",
				"daughters":[
					{"org_name":"Yellow Banana"},
					{"org_name":"Brown Banana"},
					{"org_name":"Black Banana"}
				]
				
			},
			{
				"org_name":"Big banana tree",
				"daughters":[
					{"org_name":"Yellow Banana"},
					{"org_name":"Brown Banana"},
					{"org_name":"Green Banana"},
					{
						"org_name":"Black Banana",
						"daughters":[
							{"org_name":"Phoneutria Spider"}
						]
					}
				]
			}
		]
	}

	it("should insert an organization tree into the db", function(done) {
		request(app)
			.post('/api/v1/organization')
			.set("Content-Type", "Application/json")
			.send(data)
			.end(function(err, res) {
				expect(res.body).to.be.an('array');
				expect(res.body.length).to.be.equal(8);
				done();
			})
	})

	it("should return relations of one organization from the db", function(done) {
		request(app)
			.post('/api/v1/organization')
			.set("Content-Type", "Application/json")
			.send(data)
			.end((err, res) => {
				var org_name = "black banana"

				request(app)
					.get('/api/v1/organization/' + org_name)
					.expect(200)
					.end((err, res) => {
						expect(res.body.data).to.be.an('array');
						expect(res.body.data[0]).to.have.property("relationship_type");
						expect(res.body.data[0].relationship_type).to.equal("parent");
						done();
					})
			})
	})

})