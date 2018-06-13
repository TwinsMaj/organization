let _ = require('lodash'),
	envConfig;


let config = {
	dev: 'development',
	test: 'testing',
	prod: 'production',
	port: process.env.PORT || 3000
}


process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;


// be sure app continues with default if config file not found
try {

	// load up the right config file based on environment 
	envConfig = require('./' + config.env);
	envConfig = envConfig || {}

} catch(e) {
	envConfig = {}
}


module.exports = _.assign(config, envConfig || {});
