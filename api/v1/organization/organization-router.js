var express 		= require('express'),
	organizationRouter      = express.Router(),
	organizationController  = require('./organization-controller.js');


organizationRouter.route('/')
	.post(organizationController.addOrganizations)

module.exports = organizationRouter;