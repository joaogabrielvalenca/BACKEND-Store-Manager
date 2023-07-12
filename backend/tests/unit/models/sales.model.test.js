const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../src/models/connection');
const { fakeSales } = require('../mocks/salesModel.mock');
const { salesModel } = require('../../../src/models');

describe('Teste do Model de Sales', function () {
  afterEach(function () {
    sinon.restore();
  });
    it('Testa a findAllSales ', async function () {
      sinon.stub(connection, 'execute').resolves([fakeSales]);

      const response = await salesModel.findAllSales();
      
      expect(response).to.be.an('array');
      expect(response).to.be.deep.equal(fakeSales);
    });
it('Testa a findSalesById', async function () {
  const fakeSaleId = 1;
  const fakeSale = {
    date: '2023-07-11',
    productId: 1,
    quantity: 5,
  };
  sinon.stub(connection, 'execute').resolves([[fakeSale]]);

  const [response] = await salesModel.findSalesById(fakeSaleId);

  expect(response).to.be.an('object');
  expect(response).to.deep.equal(fakeSale);
});
  it('Testa a insertSaleProducts', async function () {
    const fakeSaleId = 1;
    const fakeItemsSold = [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 5 },
    ];

    // Ajuste aqui
    const executeStub = sinon.stub(connection, 'execute');
    executeStub.callsFake((query, params) => {
      expect(query).to.equal('INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)');
      expect(params).to.deep.equal([fakeSaleId, fakeItemsSold[0].productId, fakeItemsSold[0].quantity]);

      fakeItemsSold.shift(); // Remove o primeiro elemento do array fakeItemsSold

      return Promise.resolve();
    });

    await salesModel.insertSaleProducts(fakeSaleId, [...fakeItemsSold]); // Usar [...fakeItemsSold] para criar uma cópia

    // Verifica se todos os itens foram processados
    expect(fakeItemsSold).to.be.an('array');
    expect(fakeItemsSold).to.have.length(0);
    // Verifica se o stub foi chamado a quantidade correta de vezes
    sinon.assert.callCount(executeStub, 2);
  });
  it('Deve imprimir o item no console', function () {
      const item = {
        productId: 1,
        quantity: 5,
      };

      // Capturar a saída do console.log
      const consoleLogStub = sinon.stub(console, 'log');

      // Chamar a função a ser testada
      salesModel.consoleSaleModel(item);

      // Verificar se o console.log foi chamado corretamente
     expect(consoleLogStub.calledOnce).to.equal(true);
     expect(consoleLogStub.calledWithExactly(item)).to.equal(true);

      // Restaurar o stub do console.log
      consoleLogStub.restore();
  });
   it('Deve imprimir o pass no console', function () {
      const item = {
        productId: 1,
        quantity: 5,
      };

      // Capturar a saída do console.log
      const consoleLogStub = sinon.stub(console, 'log');

      // Chamar a função a ser testada
      salesModel.consolePassPls(item);

      // Verificar se o console.log foi chamado corretamente
     expect(consoleLogStub.calledOnce).to.equal(true);
     expect(consoleLogStub.calledWithExactly(item)).to.equal(true);

      // Restaurar o stub do console.log
      consoleLogStub.restore();
  });
});
