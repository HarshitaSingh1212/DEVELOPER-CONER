// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.context.sequelize.query(`
        CREATE TABLE IF NOT EXISTS permissions (
            permission VARCHAR(255) NOT NULL 
        );
    `);
},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};