// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.context.sequelize.query(`
        CREATE TABLE IF NOT EXISTS tenants (
            tenant_id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_name VARCHAR(255) NOT NULL UNIQUE,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `);
},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};