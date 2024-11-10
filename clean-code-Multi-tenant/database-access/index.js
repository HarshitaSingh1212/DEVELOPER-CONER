const createTenantdb = require('./tenant-db');
const createChannelDb = require('./channel-db');
const createEmployeeDb = require('./employee-db');
const createProductDb = require('./product-db');
const connection = require('./database')


const tenantDb = createTenantdb(connection);
const employeeDb = createEmployeeDb(connection);
const channelDb = createChannelDb(connection);
const productDb = createProductDb(connection);

module.exports = {
  tenantDb,
  employeeDb,
  channelDb,
  productDb 
}