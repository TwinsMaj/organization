var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: "sqlite",
	storage: "/Users/SwapSpace/Documents/projects/organization/" + "/data.sqlite"
});

var db = {};

db.organizationModel = sequelize.import("./organization/organization-model.js");
db.parentModel = sequelize.import("./organization/parent-model.js");
db.conn = sequelize;

module.exports = db;
