const { expect } = require('chai');
const sinon = require('sinon');
const { productServices } = require('../../../src/services');
const { productModel } = require('../../../src/models');
const { mockNoName, mockName, mockWithLessThanFive, mockLessThanFiveResponse, mockNoNameResponse, mockResponse } = require('../mocks/productServices.mock');

describe('Testando a camada de Services de Products', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('Verifica se existe um nome', function () {
    sinon.stub(productServices, 'validateProductName').returns(mockNoNameResponse);

    const result = productServices.validateProductName(mockNoName.name);

    expect(result).to.deep.equal(mockNoNameResponse);
  });

  it('Verifica se retorna o nome', function () {
    const result = productServices.validateProductName(mockName);

    expect(result).to.equal(mockName);
  });

  it('Verifica o comprimento do nome', function () {
    sinon.stub(productServices, 'validateProductNameLength').returns(mockLessThanFiveResponse);

    const result = productServices.validateProductNameLength(mockWithLessThanFive.name);

    expect(result).to.deep.equal(mockLessThanFiveResponse);
  });

 it('Verifica a inserção do produto', async function () {
    const productName = 'Garras do Wolverine';
    const mockInsertedProduct = {
      id: 4,
      name: productName,
    };

    sinon.stub(productModel, 'insertProduct').resolves(mockInsertedProduct);

    const result = await productModel.insertProduct(productName);

    expect(result).to.deep.equal(mockResponse);
  });
});
