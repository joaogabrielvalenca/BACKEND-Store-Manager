const connection = require('./connection');

const findAllProducts = async () => {
  const [products] = await connection.execute(
    'SELECT * FROM products',
  );
  return products;
};

const findProductById = async (productId) => {
  const [product] = await connection.execute(
    'SELECT * FROM products WHERE id = ?',
    [productId],
  );
// refatorar essa parte para service
  if (product.length === 0) {
    return {
      status: 'NOT_FOUND',
      data: { message: 'Product not found' },
    };
  }
  console.log(product);
  return product;
};

const insertProduct = async (productName) => {
  const [result] = await connection.execute(
    'INSERT INTO products (name) VALUES (?)',
    [productName],
  );

  const insertedProductId = result.insertId;

  const [productData] = await connection.execute(
    'SELECT id, name FROM products WHERE id = ?',
    [insertedProductId],
  );

  const insertedProduct = {
    id: productData[0].id,
    name: productData[0].name,
  };

  return insertedProduct;
};

const updateProduct = async (id, newData) => {
  const { name } = newData;

  const [result] = await connection.execute(
    'UPDATE products SET name = ? WHERE id = ?',
    [name, id],
  );

  if (result.affectedRows === 0) {
    // Nenhum produto foi atualizado, pois o ID não foi encontrado
    return null;
  }

  // Produto atualizado com sucesso
  const updatedProduct = {
    id,
    name,
  };

  return updatedProduct;
};

module.exports = {
  findAllProducts,
  findProductById,
  insertProduct,
  updateProduct,
};
