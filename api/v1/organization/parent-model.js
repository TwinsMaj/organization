module.exports = function(sequelize, DataType){

	var Parent = sequelize.define("parent", {
		org_id: {
		    type: DataType.STRING,
		},
		parent: {
			type: DataType.STRING,
			allowNull: false,
		},
		
	})

	return Parent;

}