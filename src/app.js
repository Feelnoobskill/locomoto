'use strict';

const cors = require('cors');
const SwaggerExpressMiddleware = require('swagger-express-mw');
const SwaggerUIMiddleware = require('swagger-ui-middleware');
const configuration = require('config');
const CustomMiddleware = require('./api/modules').Middleware.init(configuration.middleware);
const port = process.env.PORT || configuration.app.port;

const config = {
    appRoot: './src' // required config
};

const express = require('express');
const app = express();

app.use(cors());
app.use(express.static(__dirname + '/../public'));


SwaggerUIMiddleware.hostUI(app, {
    path: configuration.app.swaggerUiPath,
    overrides: require('path').join(__dirname, configuration.app.swaggerJsonPath)
});

SwaggerExpressMiddleware.create(config, (err, swaggerExpress) => {
    if (err) {
        throw err;
    }
    swaggerExpress.register(app);
    app.use(CustomMiddleware.ErrorLoggingMiddleware);
});

app.listen(port, () => {
    // const testData = require('../test/testData');
    // testData.sync((res) => {});
});

// for testing
module.exports = app;