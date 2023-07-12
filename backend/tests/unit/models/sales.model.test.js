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
  });
