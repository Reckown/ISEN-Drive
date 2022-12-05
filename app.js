// modules
require('dotenv').config()

const morgan = require('morgan');
const express = require('express');
const path = require('path');
const debug = require('debug')('http');

// routers
const indexRouter = require('./routes/index.js');
const productsRouter = require('./routes/products.js');
const categoriesRouter = require('./routes/categories.js');

const app = express();
const port = process.env.PORT;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

// server start
app.listen(port, () => {
    debug('HTTP server listening');
});
