var express 		= require('express'),
	organizationRouter      = express.Router(),
	organizationController  = require('./organization-controller.js');


organizationRouter.route('/')
	.post(organizationController.addOrganizations)

organizationRouter.route('/:orgname')	
	.get(organizationController.getOrganizationRelations)

module.exports = organizationRouter;