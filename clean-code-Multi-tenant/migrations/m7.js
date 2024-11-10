// migrations/20240509120000-create-users-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
    await queryInterface.context.sequelize.query(`
    INSERT INTO IF NOT EXISTS permissions (permission) VALUES
    ('admin'),
    ('read user'),
    ('create user'),
    ('delete user'),
    ('update user'),
    ('read product'),
    ('delete product'),
    ('create product'),
    ('update product'),
    ('read channel'),
    ('create channel'),
    ('update channel'),
    ('delete channel');
`);

},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('DROP TABLE employees;');
    },
};