const shoppingCartRouter = require('express').Router();
const { Pool } = require('pg');
const uuidv4 = require('uuid/v4');

const utils = require('../utils/index');
const pgconfig = require('../config/pg-client.json');

const pool = new Pool(pgconfig);

shoppingCartRouter.get('/shopping-cart/', getShoppingCart);
shoppingCartRouter.patch(new RegExp('/shopping-cart/add'), putShoppingCart);
shoppingCartRouter.patch(new RegExp('/shopping-cart/remove'), deleteShoppingCart);
shoppingCartRouter.put(new RegExp('/shopping-cart/(' + utils.guidExp + ')/quantity'), updateShoppingCartQuantity);
shoppingCartRouter.post('/shopping-cart/complete', completeShoppingCart);

/**
 * This endpoint will fetch the session based 
 * shopping cart and give the results of the search
 * GET api/shopping-cart/
 * 
 * @param {*} req
 * @param {*} res
 */
async function getShoppingCart(req, res) {
    
    var total = 0.00;
    var items;

    if (req.session.shoppingCart) {

        var queryStr = "SELECT product.product_id,item.quantity,product.title," +
                        "product.price::money::numeric::float8 FROM " + 
                        "ShoppingCartItems AS item, Products AS product " +
                        "WHERE item.shopping_cart_id = $1 AND product.product_id = item.product_id;"

        var query = await pool.query(queryStr, [req.session.shoppingCart]);
        
        for (var i = 0; i < query.rows.length; i++) {
            total += query.rows[i].price * query.rows[i].quantity;
        }

        items = query.rows;
    } else {

        req.session.shoppingCart = uuidv4();
        items = [];
    }

    res.status(200).json({
        products: items,
        total: total
    }).end();
}


/**
 * This endpoint exposes the session based shopping cart and add the 
 * products and the quantities that the user wishes to purchase.
 * PATH api/shopping-cart/add
 * 
 * @param {*} req
 * @param {*} res
 */
function putShoppingCart(req, res) {
    
    if (!req.session.shoppingCart) req.session.shoppingCart = uuidv4();
    
    var safeVarCtr = 1;
    var safeVars = [];
    var values = [];
    for (var i = 0; i < req.body.length; i++) {

        if (req.body[i].quantity <= 0) {
            res.status(400).json({
                message: 'Cannot have a quantity less than 1'
            }).end();
        }

        values.push('($'+safeVarCtr+++',$'+safeVarCtr+++',$'+safeVarCtr+++')');
        safeVars.push(req.session.shoppingCart);
        safeVars.push(req.body[i].quantity);
        safeVars.push(req.body[i].product_id);
    }

    var queryStr = "INSERT INTO ShoppingCartItems VALUES" + values.join(',') + '';
    pool.query(queryStr, safeVars)
        .then(function(queryRes) {
            res.status(204).end();
        })
        .catch(function(err) {

            // This is the error code that describes a foreign key violation
            if (err.code === "23503") {
                res.status(404).json({
                    message: "One of the product_id's is not an actual product"
                });
            } else {
                res.status(500).end();
            }
        });
}


/**
 * This endpoint will fetch the session based 
 * shopping cart and remove the specified products
 * PATCH api/shopping-cart/remove
 * 
 * @param {*} req
 * @param {*} res
 */
function deleteShoppingCart(req, res) {
    
    if (req.session.shoppingCart) {

        var safeVarsCtr = 1;
        var safeVars = [];
        var values = [];

        for (var i = 0; i < req.body.length; i++) {
            values.push('product_id = $' + safeVarsCtr++ + '');
            safeVars.push(req.body[i]);
        }

        var queryStr = "DELETE FROM ShoppingCartItems WHERE " + values.join(' AND ');

        pool.query(queryStr, safeVars)
            .then(function(queryRes) {

                // This checks the rows affected
                if (queryRes.rowCount >= 1) {
                    res.status(200).end();
                } else {
                    res.status(404).json({
                        message: "One of the product_id's is not an actual product"
                    }).end();
                }
            })
            .catch(function(err) {

                res.status(500).end();
            });
    } else {
        
        req.session.shoppingCart = uuidv4();
        // because there is no data, i'll just return an ok code
        res.status(200).end();
    }
}

/**
 * This endpoint will update a shopping cart product's quantity
 * PUT api/shopping-cart/:prod_id/quantity
 * 
 * @param {*} req
 * @param {*} res
 */
function updateShoppingCartQuantity(req, res) {

    if (req.session.shoppingCart) {

        if (typeof req.body.amount !== "number" || req.body.amount <= 0) {
            res.status(400).json({
                message: "cannot update the quantity thats less than 1"
            }).end();
        }

        var queryStr = "UPDATE ShoppingCartItems SET quantity = $1 WHERE product_id = $2 AND shopping_cart_id = $3";

        pool.query(queryStr, [req.body.amount, req.params['0'], req.session.shoppingCart])
            .then(function(queryRes) {

                // number of rows affected
                if (queryRes.rowCount >= 1) {
                    res.status(204).end();
                } else {
                    res.status(404).json({
                        message: "One of the product_id's is not an actual product"
                    }).end();
                }
            })
            .catch(function(err) {

                res.status(500).end();
            })

    } else {

        req.session.shoppingCart = uuidv4();
        
        res.status(404).json({
            message: "cannot delete an item when you just started to shop"
        }).end();
    }
}

/**
 * This endpoint will process the shopping card and validate 
 * whether the cart is valid and can be completed
 * POST api/shopping-cart/complete
 * 
 * @param {*} req
 * @param {*} res
 */
async function completeShoppingCart(req, res) {

    if (req.session.shoppingCart) {

        try {
            var client = await pool.connect();

            var queryStr = "SELECT item.quantity,prod.product_id,prod.inventory_count " +
                            "FROM ShoppingCartItems AS item, Products AS prod WHERE " +
                            "item.shopping_cart_id = $1 AND item.product_id = prod.product_id";

            var query = await client.query(queryStr, [req.session.shoppingCart]);

            if (query.rows.length === 0) {
                res.status(400).end();
                return;
            }

            // begin to check if the items can be processed
            for (var i = 0; i < query.rows.length; i++) {
                    
                var row = query.rows[i];
                if (row.inventory_count < 1) {
                    res.status(409).json({
                        message: 'The inventory count for an item was 0... could not process transaction'
                    }).end();
                    return;
                }
                if (row.quantity > row.inventory_count) {
                    
                    res.status(409).json({
                        message: 'Could not process shopping cart, An item quantity wished for was higher than the actual inventory'
                    }).end();
                    return;
                }
            }

            // begin the transaction stage
            for (var i = 0; i < query.rows.length; i++) {
                    
                var row = query.rows[i];

                await client.query('UPDATE Products SET inventory_count = $1 WHERE product_id = $2', [row.inventory_count - row.quantity, row.product_id]);
            }
            client.release();

            res.status(204).end();
        } catch(err) {

            res.status(500).end();
        }
    } else {

        req.session.shoppingCart = uuidv4();

        res.status(400).end();
    }
}

module.exports = shoppingCartRouter;