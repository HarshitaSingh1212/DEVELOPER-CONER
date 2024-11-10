// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.context.sequelize.query(`
        CREATE TABLE employees (
            employee_id VARCHAR(255) PRIMARY KEY,
            tenant_id INT NOT NULL,
            employee_name VARCHAR(255) NOT NULL,
            employee_email VARCHAR(255) NOT NULL,
            employee_password VARCHAR(255),
            employee_status VARCHAR(255) DEFAULT 'Inactive',
            permissions JSON NOT NULL,
            FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
            CONSTRAINT unique_tenant_employee_email UNIQUE (tenant_id, employee_email)
        );
        `);

},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};