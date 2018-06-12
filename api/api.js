var express = require('express'),
	api		= express.Router(),
	organizationRoute = require('./v1/organization/organization-router.js');

// mount routes
api.use('/organization', organizationRoute);

module.exports = api