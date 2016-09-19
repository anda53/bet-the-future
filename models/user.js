'use strict';
module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		FirstName: DataTypes.STRING,
		LastName: DataTypes.STRING,
		UserName: DataTypes.STRING,
		Email: DataTypes.STRING,
		Password: DataTypes.STRING,
		ImageLink: DataTypes.STRING
	}, {
	classMethods: {
		associate: function(models) {
			// associations can be defined here
			User.belongsToMany(User, { as: 'Friends', through: 'UserFriends'})
			User.belongsToMany(models.Bet, {through: 'UserBet'})
		}
	}
});
return User;
};