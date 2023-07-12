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
  });

// it('deve lidar com erro de conexão ao buscar todos os produtos', async function () {
//   const connectionError = new Error('Erro de conexão');
//   sinon.stub(connection, 'execute').rejects(connectionError);

//   try {
//     await productModel.findAllProducts();
//     // Se o código chegar aqui, significa que a lógica de tratamento de erro não está funcionando corretamente
//     expect.fail('A função deveria lançar um erro');
//   } catch (error) {
//     expect(error.message).to.equal('Erro de conexão');
//     // Verificar se a mensagem de erro é a esperada
//   }
// });
