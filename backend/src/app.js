const express = require('express');
const { productModel, salesModel } = require('./models');
const { productServices, salesServices } = require('./services');

const app = express();

app.use(express.json());

app.get('/products', async (_req, res) => {
  const products = await productModel.findAllProducts();
  return res.status(200).json(products);
});

app.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const product = await productModel.findProductById(productId);
  if (product.status === 'NOT_FOUND') {
    return res.status(404).json(product.data);
  }
  return res.status(200).json(product[0]);
});

app.get('/sales', async (_req, res) => {
  const sales = await salesModel.findAllSales();
  return res.status(200).json(sales);
});

app.get('/sales/:salesId', async (req, res) => {
  const { salesId } = req.params;
  const sale = await salesModel.findSalesById(salesId);
  if (sale.length === 0) return res.status(404).json({ message: 'Sale not found' });
  return res.status(200).json(sale);
});

app.post('/products', async (req, res) => {
  const { name } = req.body;
  const validateNameExists = productServices.validateProductName(name);
  if (validateNameExists.status === 'BAD_REQUEST') {
    return res.status(400).json(validateNameExists.data);
  }
  const fiveLettersOrMore = productServices.validateProductNameLength(name);
  if (fiveLettersOrMore.status === 'UNPROCESSABLE_ENTITY') {
    return res.status(422).json(fiveLettersOrMore.data);
  }
  productServices.validateProductNameLength(name);
  const productInsert = await productModel.insertProduct(name);
  return res.status(201).json(productInsert);
});
 
app.post('/sales', async (req, res) => {
  const { body } = req;
  
  const verifyMissingId = await salesServices.hasMissingProductId(body);
  if (verifyMissingId.status === 'BAD_REQUEST') {
    return res.status(400).json(verifyMissingId.data);
  }  

  const verifyMissingQuantity = await salesServices.hasMissingQuantity(body);  
  if (verifyMissingQuantity.status === 'BAD_REQUEST') {
    return res.status(400).json(verifyMissingQuantity.data);
  } 

  const verifyQuantity = await salesServices.hasInvalidQuantity(body);
  if (verifyQuantity.status === 'UNPROCESSABLE_ENTITY') {
    return res.status(422).json(verifyQuantity.data);
  }

  const verifyProductIds = await salesServices.validateProductIds(body);
  const hasProductNotFound = verifyProductIds.some((result) => result.status === 'NOT_FOUND');
  if (hasProductNotFound) return res.status(404).json({ message: 'Product not found' });
  
  const sale = await salesModel.createSale(body);
  return res.status(201).json(sale);
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const numberId = Number(id);

  const verifyIfNameExists = productServices.validateProductName(name);
  if (verifyIfNameExists.status === 'BAD_REQUEST') {
    return res.status(400).json(verifyIfNameExists.data);
  }

  const verifyLength = await productServices.validateProductNameLength(name);
  if (verifyLength.status === 'UNPROCESSABLE_ENTITY') {
    return res.status(422).json(verifyLength.data);
  }
  
  const productToEdit = await productModel.findProductById(id);
  if (productToEdit.status === 'NOT_FOUND') {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = await productModel.updateProduct(numberId, { name });
  return res.status(200).json(updatedProduct);
});

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.json({ status: 'Store Manager UP!!' });
});

module.exports = app;
