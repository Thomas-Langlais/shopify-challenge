const shoppingCartRouter = require('express').Router();
const { Pool } = require('pg');

const utils = require('../utils/index');
const pgconfig = require('../config/pg-client.json');

const pool = new Pool(pgconfig);

shoppingCartRouter.get('/shopping-cart/', getShoppingCart);
shoppingCartRouter.patch(new RegExp('/shopping-cart/' + utils.guidExp + '/add'), putShoppingCart);
shoppingCartRouter.patch(new RegExp('/shopping-cart/' + utils.guidExp + '/remove'), deleteShoppingCart);
shoppingCartRouter.put(new RegExp('/shopping-cart/' + utils.guidExp + '/quantity'), updateShoppingCartQuantity);
shoppingCartRouter.post('/shopping-cart/complete', completeShoppingCart);

/**
 * This endpoint 
 * 
 * @param {*} req
 * @param {*} res
 */
function getShoppingCart(req, res) {
    
    res.status(400).send('not implemented');
}


/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function putShoppingCart(req, res) {
    
    res.status(400).send('not implemented');
}


/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function deleteShoppingCart(req, res) {
    
    res.status(400).send('not implemented');
}

function updateShoppingCartQuantity(req, res) {

    res.status(400).send('not implemented');
}

function completeShoppingCart(req, res) {

    res.status(400).send('not implemented');
}

module.exports = shoppingCartRouter;