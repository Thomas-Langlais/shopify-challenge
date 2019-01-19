const shoppingCartRouter = require('express').Router();
const utils = require('../utils/index');

shoppingCartRouter.get('/shopping-cart/', getShoppingCart);
shoppingCartRouter.put(new RegExp('/shopping-cart/'+ utils.guidExp), putShoppingCart);
shoppingCartRouter.delete(new RegExp('/shopping-cart/'+ utils.guidExp), deleteShoppingCart);

/**
 * This endpoint 
 * 
 * @param {*} req
 * @param {*} res
 */
function getShoppingCart(req, res) {
    res.json({ message: 'get shopping cart' });
}


/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function putShoppingCart(req, res) {
    res.json({ message: 'put in shopping cart' });
}


/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function deleteShoppingCart(req, res) {
    res.json({ message: 'delete in shopping cart' });
}

module.exports = shoppingCartRouter;