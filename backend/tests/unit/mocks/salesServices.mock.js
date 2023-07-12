const requestBody = [
  {
    productId: 1,
    quantity: 1,
  },
  {
    productId: 2,
    quantity: 5,
  },
];

const mockResponse = {
  id: 3,
  itemsSold: requestBody,
};

module.exports = {
  requestBody,
  mockResponse,
};