const { productModel } = require('../models');

const hasMissingProductId = (items) => {
  const verifyProductId = items.some((item) => !item.productId);
  if (verifyProductId) {
    return {
      status: 'BAD_REQUEST',
      data: { message: '"productId" is required' },
    };
  }
  return items;
};

const hasMissingQuantity = (items) => {
  const verifyMissingQuantity = items.some((item) => !item.quantity && item.quantity !== 0);
  if (verifyMissingQuantity) {
    return {
      status: 'BAD_REQUEST',
      data: { message: '"quantity" is required' },
    };
  }
  return items;
};

const hasInvalidQuantity = (items) => {
  const verifyInvalidQuantity = items.some((item) => item.quantity <= 0);
  if (verifyInvalidQuantity) {
    return {
      status: 'UNPROCESSABLE_ENTITY',
      data: { message: '"quantity" must be greater than or equal to 1' },
    };
  }
  return items;
};

const validateProductIds = async (items) => {
  const promises = items.map((item) => {
    const { productId } = item;
    const product = productModel.findProductById(productId);
    return product;
  });
  const results = await Promise.all(promises);
  console.log(results);
  return results;
};

module.exports = {
  hasMissingProductId,
  hasMissingQuantity,
  hasInvalidQuantity,
  validateProductIds,
};