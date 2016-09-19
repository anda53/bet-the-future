'use strict';
module.exports = function(sequelize, DataTypes) {
  var Bet = sequelize.define('Bet', {
    adminPlayer: DataTypes.STRING,
    adminImageLink: DataTypes.STRING,
    prediction: DataTypes.STRING,
    challenge: DataTypes.STRING,
    secondPlayer: DataTypes.STRING,
    referee: DataTypes.STRING,
    winner: DataTypes.STRING,
    pending: DataTypes.BOOLEAN,
    price: DataTypes.STRING,
    judgmentDay: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Bet.belongsToMany(models.User, {through: 'UserBet'})
      }
    }
  });
  return Bet;
};