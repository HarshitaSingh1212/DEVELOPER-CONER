const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

 
const sequelize = new Sequelize('EXERCISE', 'harshita', 'Harshita@123', {
  host: 'localhost',
  dialect: 'mysql',
});
 
const umzug = new Umzug({
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});
 
(async () => {
  await umzug.up();
})();
   

module.exports = sequelize;
 

//  {
//   "image_url":"https://plus.unsplash.com/premium_photo-1678112180202-cd950dbe5a35?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXJsfGVufDB8fDB8fHww",
//   "price":2000,
//   "product_name":"xbox",
//   "product_type":"digital",
//   "product_description":"most amazing so far"
//  }

// {
//   "tenant_fullname":"hhh",
//   "employee_email":"h@h.com",
//   "employee_name":"harhs",
//   "employee_password":"harhs"
// }