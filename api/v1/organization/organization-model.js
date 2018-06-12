module.exports = function(sequelize, DataType){

	var Organization = sequelize.define("organization", {
		id: {
		    type: DataType.STRING,
		    primaryKey: true,
		    unique: true,
		    autoIncrement: false
		},
		name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true
		},
		
	})

	return Organization;

}