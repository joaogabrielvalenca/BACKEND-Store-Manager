const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../src/models/connection');
const { productModel } = require('../../../src/models');
const { fakeProducts, fakeProductById, errorMessage } = require('../mocks/productModel.mock');

describe('GET /products', function () {
  afterEach(function () {
    sinon.restore();
    });
  it('Ver todos os produtos com sucesso', async function () {
      sinon.stub(connection, 'execute').resolves([fakeProducts]);

      const response = await productModel.findAllProducts();

      expect(response).to.be.an('array');
      expect(response).to.be.deep.equal(fakeProducts);
    });
  it('retorna o produto especificado pelo ID', async function () {
      //  ele vai simular o funcionamento da connection execute. e ai o resolves é o que execute vai retornar pra mim
      sinon.stub(connection, 'execute').resolves([fakeProductById]);

      const inputData = 2;
      const response = await productModel.findProductById(inputData);

      expect(response).to.be.an('array');
      expect(response).to.deep.equal(fakeProductById);
    });

  it('Deve retornar um erro com um valor de ID inválido', async function () {
      sinon.stub(connection, 'execute').resolves([errorMessage]);

      const inputData = 5930;
      const response = await productModel.findProductById(inputData);

      expect(response).to.be.an('array');
      expect(response).to.deep.equal([{ message: 'Product not found' }]);
    });

  it('Deve retornar um erro com um valor de ID inválido sendo string', async function () {
      sinon.stub(connection, 'execute').resolves([errorMessage]);

      const inputData = 'A';
      const response = await productModel.findProductById(inputData);

      expect(response).to.be.an('array');
      expect(response).to.deep.equal([{ message: 'Product not found' }]);
  });
it('Testa a atualização de um produto existente', async function () {
  const productId = 1;
  const newProductName = 'Nova Garras do Wolverine';
  const updatedProduct = {
    id: productId,
    name: newProductName,
  };

  const mockExecute = sinon.stub(connection, 'execute');
  mockExecute.resolves([{ affectedRows: 1 }]);

  const result = await productModel.updateProduct(productId, { name: newProductName });

  expect(result).to.deep.equal(updatedProduct);
  sinon.assert.calledOnceWithExactly(mockExecute, 'UPDATE products SET name = ? WHERE id = ?', [newProductName, productId]);

  // Restaurar o stub para o comportamento original
  mockExecute.restore();
});
it('Testa a atualização de um produto inexistente', async function () {
  const fakeId = 1;
  const fakeNewData = { name: 'Novo Produto' };

  const executeStub = sinon.stub(connection, 'execute');
  executeStub.resolves([{ affectedRows: 0 }]); // Simula a atualização sem sucesso (ID não encontrado)

  const result = await productModel.updateProduct(fakeId, fakeNewData);

  expect(result).to.equal(null);

  sinon.assert.calledOnceWithExactly(
    executeStub,
    'UPDATE products SET name = ? WHERE id = ?',
    [fakeNewData.name, fakeId],
  );

  // Restaurar o stub para o comportamento original
  executeStub.restore();
});
});
