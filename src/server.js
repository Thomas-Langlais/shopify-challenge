// call the packages we need
const express = require('express');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');
const { Client } = require('pg');

var app = express();

const productRouter = require('./routes/product');
const shoppingCartRouter = require('./routes/shoppingcart');

var port = process.env.PORT || 8080;

app.set('trust proxy', 1);
app.use(session({
    secret: 'shopify-challenge',
    genid: function(req) {
        return uuidv4();
    },
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));
app.use(bodyParser.json());

// register the routes with a prefix of api
app.use('/api', productRouter);
app.use('/api', shoppingCartRouter);

// start the server
app.listen(port);
console.log('Opened port ' + port);

/**
 * This hook is used to clear the shopping cart rows, as the 
 * sessions will all be wiped
 */
process.on('exit', async function() {

    const client = new Client(pgConfig);
    
    await client.connect();
    await client.query('TRUNCATE ShoppingCartItems');
    await client.end();
})