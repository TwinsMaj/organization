let config 		= require('../../config/config.js'),
	Sequelize 	= require("sequelize");

let sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	dialect: config.db.dialect,
	storage: config.approot + "/data.sqlite"
});

let db = {};

db.organizationModel = sequelize.import("./organization/organization-model.js");
db.parentModel = sequelize.import("./organization/parent-model.js");
db.conn = sequelize;

module.exports = db;
