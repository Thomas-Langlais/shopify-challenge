const productRouter = require('express').Router();
const utils = require('../utils/index');

productRouter.get('/products', getAllProducts);
productRouter.get(new RegExp('/products/' + utils.guidExp), getProduct);


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
    res.json({ message: 'get all products' })
}

/**
 * This endpoint will fetch the product data that has the Guid from the URI
 * Endpoint: /api/products/72326fd4-a0a2-4985-bf80-11e97ae1445b
 *  
 * @param {*} req
 * @param {*} res
 */
function getProduct(req, res) {
    res.json({ message: 'get a product' })
}

module.exports = productRouter;