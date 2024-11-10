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
