const makeGetCategoriesEntity = require('../../entities').makeGetCategoriesEntity; 
module.exports = function makeAddCategoriesMetadata({
  storesDb,
  getCategoriesList,
}) {
  return async function addCategoriesMetadata({
    tenantId,
    storeId,
    workspaceId,
    syncId,
    name,
  }) {

    const getCategoriesEntityObj = makeGetCategoriesEntity({
      tenantId,
      storeId,
      workspaceId,
      syncId,
      name,
    });

    const {getTenantId, getWorkspaceId, getName, getStoreId, getSyncId} = getCategoriesEntityObj;

    const {totalCount} = await getCategoriesList({
      tenantId: getTenantId(),
      workspaceId: getWorkspaceId(),
      storeId: getStoreId(),
      syncId: getSyncId(),
      name: getName(),
    });

    await storesDb.setStoreItemCount({
      count: totalCount,
      item: 'category',
      storeId: getStoreId(),
      logger,
    });

    return true;
  };
};
