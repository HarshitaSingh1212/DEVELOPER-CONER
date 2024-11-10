// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.context.sequelize.query(`
        CREATE TABLE IF NOT EXISTS channel (
            tenant_id INT NOT NULL,
            channel_id INT AUTO_INCREMENT PRIMARY KEY ,
            channel_code VARCHAR(255) NOT NULL,
            channel_name VARCHAR(255) NOT NULL,
            CONSTRAINT unique_tenant_channel UNIQUE (tenant_id, channel_code, channel_name)
        );
        `);
},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};