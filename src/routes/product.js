const productRouter = require('express').Router();
const { Pool } = require('pg');

const utils = require('../utils/index');
const pgconfig = require('../config/pg-client.json');

productRouter.get('/products', getAllProducts);
productRouter.get(new RegExp('/products/' + utils.guidExp), getProduct);

const pool = new Pool(pgconfig);

/**
 * This endpoint will fetch all the product data from the database
 * Endpoint: /api/products/
 * 
 * urlParams:
 *  allAvailable: bool - filters out all 
 * 
 * @param {*} req
 * @param {*} res
 */
async function getAllProducts(req, res) {

    res.status(400).send('not implemented');
    // var query = await pool.query('SELECT * FROM Products');

    // res.json(query.rows);
}

/**
 * This endpoint will fetch the product data that has the Guid from the URI
 * Endpoint: /api/products/72326fd4-a0a2-4985-bf80-11e97ae1445b
 *  
 * @param {*} req
 * @param {*} res
 */
async function getProduct(req, res) {

    res.status(400).send('not implemented');
}

module.exports = productRouter;