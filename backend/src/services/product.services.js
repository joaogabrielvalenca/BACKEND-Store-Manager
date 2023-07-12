function validateProductName(name) {
  if (!name) {
    return {
      status: 'BAD_REQUEST',
      data: { message: '"name" is required' },
    };
  }
  return name;
}

function validateProductNameLength(name) {
  if (name.length < 5) {
    return {
      status: 'UNPROCESSABLE_ENTITY',
      data: { message: '"name" length must be at least 5 characters long' },
    };
  }
  return name;
}

module.exports = {
  validateProductName,
  validateProductNameLength,
};