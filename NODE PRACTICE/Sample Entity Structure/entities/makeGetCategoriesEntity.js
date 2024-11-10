module.exports = function buildMakeGetCategoriesEntity({Joi, ValidationError}) {
  return function makeGetCategoriesEntity({
    tenantId,
    storeId,
    workspaceId,
    syncId,
    name,
  }) {
    const schema = Joi.object({
      tenantId: Joi.string().guid(),
      storeId: Joi.string().domain(),
      workspaceId: Joi.number().integer(),
      syncId: Joi.number().integer(),
      name: Joi.string().allow('', null),
    });
    const {value, error} = schema.validate({
      tenantId,
      storeId,
      workspaceId,
      syncId,
      name,
    });
    if (error) {
      throw new ValidationError(error.message);
    }
    return Object.freeze({
      getTenantId: () => value.tenantId,
      getStoreId: () => value.storeId,
      getWorkspaceId: () => value.workspaceId,
      getSyncId: () => value.syncId,
      getName: () => value.name,
    });
  };
};