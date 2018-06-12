module.exports = function(sequelize, DataType){

	var Parent = sequelize.define("parent", {
		id: {
		    type: DataType.STRING,
		    primaryKey: true,
		    unique: true,
		    autoIncrement: false
		},
		parent: {
			type: DataType.STRING,
			allowNull: false,
			unique: true
		},
		
	})

	return Parent;

}