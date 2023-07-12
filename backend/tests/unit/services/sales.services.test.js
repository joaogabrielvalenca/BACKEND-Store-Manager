const { expect } = require('chai');
const sinon = require('sinon');
const { mockResponse, requestBody } = require('../mocks/salesServices.mock');
const { salesServices } = require('../../../src/services');
const { salesModel } = require('../../../src/models');
const { productModel } = require('../../../src/models');

describe('Testando a camada de Services de Sales', function () {
  afterEach(function () {
    sinon.restore();
  });
  it('Verifica o cadastro de venda com sucesso', async function () {
    sinon.stub(salesModel, 'createSale').resolves(mockResponse);

    const result = await salesModel.createSale(requestBody);

    expect(result).to.deep.equal(mockResponse);
  });
  it('Verifica a inserção de venda com sucesso', async function () {
    sinon.stub(salesModel, 'createSale').resolves(mockResponse);

    const result = await salesModel.createSale(requestBody);

    expect(result).to.deep.equal(mockResponse);
  });
  
  it('Verifica a inserção de venda com produtos existente', async function () {
    sinon.stub(productModel, 'findProductById')
      .onFirstCall().resolves({ id: 1, name: 'Product 1' })
      .onSecondCall()
      .resolves(null);

    const result = await salesServices.validateProductIds(requestBody);

    expect(result[0]).to.deep.equal({ id: 1, name: 'Product 1' });
    expect(result[1]).to.equal(null);
  });
  it('Verifica se há produtoId ausente', function () {
    const itemsWithProductId = [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 5 },
    ];

    const itemsWithoutProductId = [
      { quantity: 1 },
      { productId: 2, quantity: 5 },
    ];

    const resultWithProductId = salesServices.hasMissingProductId(itemsWithProductId);
    const resultWithoutProductId = salesServices.hasMissingProductId(itemsWithoutProductId);

    expect(resultWithProductId).to.deep.equal(itemsWithProductId);
    expect(resultWithoutProductId).to.deep.equal({
      status: 'BAD_REQUEST',
      data: { message: '"productId" is required' },
    });
  });
  it('Verifica se há quantidade ausente', function () {
  const itemsWithQuantity = [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 5 },
  ];

  const itemsWithoutQuantity = [
    { productId: 1 },
    { productId: 2, quantity: null },
  ];

  const resultWithQuantity = salesServices.hasMissingQuantity(itemsWithQuantity);
  const resultWithoutQuantity = salesServices.hasMissingQuantity(itemsWithoutQuantity);

  expect(resultWithQuantity).to.deep.equal(itemsWithQuantity);
  expect(resultWithoutQuantity).to.deep.equal({
    status: 'BAD_REQUEST',
    data: { message: '"quantity" is required' },
  });
  });
  it('Verifica se há quantidade inválida', function () {
  const validItems = [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 5 },
  ];

  const invalidItems = [
    { productId: 1, quantity: 0 },
    { productId: 2, quantity: -5 },
  ];

  const resultValidItems = salesServices.hasInvalidQuantity(validItems);
  const resultInvalidItems = salesServices.hasInvalidQuantity(invalidItems);

  expect(resultValidItems).to.deep.equal(validItems);
  expect(resultInvalidItems).to.deep.equal({
    status: 'UNPROCESSABLE_ENTITY',
    data: { message: '"quantity" must be greater than or equal to 1' },
  });
});
});