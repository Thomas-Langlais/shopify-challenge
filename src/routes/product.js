const productRouter = require('express').Router();
const { Pool } = require('pg');

const utils = require('../utils/index');
const pgconfig = require('../config/pg-client.json');

productRouter.get('/products', getAllProducts);
productRouter.get(new RegExp('/products/(' + utils.guidExp + ')'), getProduct);

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
function getAllProducts(req, res) {

    var whereClause = '';

    // check the query param
    if (req.query.allAvailable === "true") {
        whereClause = 'WHERE inventory_count > 0';
    }
    
    pool.query('SELECT product_id,title,price::money::numeric::float8,inventory_count FROM Products ' + whereClause)
        .then(function(query) {
            res.status(200).json(query.rows);
        })
        .catch(function(err) {
            res.status(500).end();
        });
}

/**
 * This endpoint will fetch the product data that has the Guid from the URI
 * Endpoint: /api/products/72326fd4-a0a2-4985-bf80-11e97ae1445b
 *  
 * @param {*} req
 * @param {*} res
 */
function getProduct(req, res) {
    
    var productId = req.params['0'];

    pool.query("SELECT * FROM Products WHERE product_id = $1", [productId])
        .then(function(query) {
            
            // get the row
            if (query.rows.length > 0) {

                var product = query.rows[0];
                res.status(200).json(product);
            } else {

                res.status(404).end();
            }
        })
        .catch(function(err) {
            res.status(500).end();
        })
}

module.exports = productRouter;