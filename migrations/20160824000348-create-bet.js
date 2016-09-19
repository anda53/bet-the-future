'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Bets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      adminPlayer: {
        type: Sequelize.STRING
      },
      adminImageLink: {
        type: Sequelize.STRING
      },
      prediction: {
        type: Sequelize.STRING
      },
      challenge: {
        type: Sequelize.STRING
      },
      secondPlayer: {
        type: Sequelize.STRING
      },
      referee: {
        type: Sequelize.STRING
      },
      winner: {
        type: Sequelize.STRING
      },
      pending: {
        type: Sequelize.BOOLEAN
      },
      price: {
        type: Sequelize.STRING
      },
      judgmentDay: {
        type: Sequelize.DATEONLY
        // DATEONLY is the option we want
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Bets');
  }
};