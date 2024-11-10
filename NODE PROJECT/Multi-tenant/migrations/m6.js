// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.context.sequelize.query(`
        CREATE TABLE product_translation (
            tenant_id INT NOT NULL,
            product_id INT NOT NULL,
            product_name VARCHAR(255),
            product_type VARCHAR(255),
            product_url VARCHAR(255),
            product_description TEXT,
            channel_code VARCHAR(255) NOT NULL,
            CONSTRAINT unique_tenant_product UNIQUE (tenant_id, product_id)
        );
        
    `);

},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};