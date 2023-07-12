// NAO ESTA PRONTO ESSE MOCK DE FAKEPRODUCTS;

const mockNoName = {
  name: '', 
};

const mockName = {
  name: 'Garras do Wolverine',
};

const mockWithLessThanFive = {
  name: 'abc',
};

const mockLessThanFiveResponse = {
  status: 'UNPROCESSABLE_ENTITY',
  data: { message: '"name" length must be at least 5 characters long' },
};

const mockNoNameResponse = {
  status: 'BAD_REQUEST',
  data: { message: '"name" is required' },
};

const mockResponse = {
  id: 4,
  name: 'Garras do Wolverine',
}; 

module.exports = {
  mockNoName,
  mockName,
  mockWithLessThanFive,
  mockLessThanFiveResponse,
  mockNoNameResponse,
  mockResponse,
};