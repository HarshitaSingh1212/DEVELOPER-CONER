const Joi = require('@hapi/joi');
const {
  ValidationError,
} = require('../../exceptions');

const buildMakeGetCategoriesEntity = require('./makeGetCategoriesEntity');
const makeGetCategoriesEntity = buildMakeGetCategoriesEntity({Joi, ValidationError});

module.exports = Object.freeze({
  makeGetCategoriesEntity
})