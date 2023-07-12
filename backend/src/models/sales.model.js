const connection = require('./connection');

const findAllSales = async () => {
  const [sales] = await connection.execute(`
    SELECT
      s.id AS saleId,
      s.date,
      sp.product_id AS productId,
      sp.quantity
    FROM
      sales AS s
      INNER JOIN sales_products AS sp ON s.id = sp.sale_id
      INNER JOIN products AS p ON sp.product_id = p.id
    ORDER BY
      s.id ASC,
      sp.product_id ASC
  `);
  return sales;
};

const findSalesById = async (salesId) => {
  const [sale] = await connection.execute(`
    SELECT
      s.date,
      sp.product_id AS productId,
      sp.quantity
    FROM
      sales AS s
      INNER JOIN sales_products AS sp ON s.id = sp.sale_id
      INNER JOIN products AS p ON sp.product_id = p.id
    WHERE
      s.id = ?
  `, [salesId]);

  return sale;
};

const insertSaleProducts = async (saleId, itemsSold) => {
  const insertPromises = itemsSold.map(async (item) => {
    const { productId, quantity } = item;
    await connection.execute(
      'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
      [saleId, productId, quantity],
    );
  });

  const resolvedPromises = await Promise.all(insertPromises);
  return resolvedPromises;
};
const createSale = async (itemsSold) => {
  const insertSale = await connection.execute(
    'INSERT INTO sales (date) VALUES (CURRENT_TIMESTAMP)',
  );

  // const [result] = await connection.execute('SELECT LAST_INSERT_ID() as saleId');
  // const { saleId } = result[0];
  // console.log('saleId', saleId);
  console.log('abc', insertSale[0].insertId);
  await insertSaleProducts(insertSale[0].insertId, itemsSold);

  const response = {
    id: insertSale[0].insertId,
    itemsSold,
  };

  return response;
};

const consoleSaleModel = (item) => {
  console.log(item);
};

const consolePassPls = (pass) => {
  console.log(pass);
};

module.exports = {
  findAllSales,
  findSalesById,
  insertSaleProducts,
  createSale,
  consoleSaleModel,
  consolePassPls,
};