// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.context.sequelize.query(`
        CREATE TABLE IF NOT EXISTS product (
            tenant_id INT NOT NULL,
            product_id INT AUTO_INCREMENT PRIMARY KEY,
            image_url JSON,
            price DECIMAL(10, 2) NOT NULL,
            CONSTRAINT unique_tenant_product UNIQUE (tenant_id, product_id)
        );
        `);
},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};