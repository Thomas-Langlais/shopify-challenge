// call the packages we need
var express = require('express');
var { Client } = require('pg');

var app = express();

const pgConfig = require('./config/pg-client.json');

const productRouter = require('./routes/product');
const shoppingCartRouter = require('./routes/shoppingcart');

var port = process.env.PORT || 8080;

// register the routes with a prefix of api
app.use('/api', productRouter);
app.use('/api', shoppingCartRouter);

// start the server
app.listen(port);
console.log('Opened port ' + port);