'use strict';

const errors = require('errors');

function formatHttpError(err) {
    const httpError = {
        status: err.status || err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    };

    if (errors.find(err.name)) {
        const mappedError = errors.mapError(err);
        if (mappedError) {
            httpError.status = mappedError.status;
            httpError.message = mappedError.message;
        }
    }
    if (httpError.status === 400) {
        // we need to bubble up swagger validation errors to client
        delete err.message;
        delete err.stack;
        delete err.statusCode;
        httpError.message = err;
    }

    return httpError;
}

module.exports = {
    errors: errors,
    formatHttpError: formatHttpError
};