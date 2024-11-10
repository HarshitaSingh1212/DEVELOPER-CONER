// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.context.sequelize.query(`
        CREATE TABLE product (
            tenant_id INT NOT NULL,
            product_id INT AUTO_INCREMENT PRIMARY KEY,
            image_url JSON,
            price DECIMAL(10, 2) NOT NULL
        );
        `);
},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};