const {
  storesDb,
} = require('../../data-access');

const {categoriesUsecases} = require('../magento');

const makeAddCategoriesMetadata = require('./add-categories-metadata');
const addCategoriesMetadata = makeAddCategoriesMetadata({
  storesDb,
  getCategoriesList: categoriesUsecases.getCategoriesList,
});

module.exports = Object.freeze({
  addCategoriesMetadata,
});
