'use strict';

const Errors = require('../errors');
const config = require('config');

module.exports.init = (options) => {

    return {
        ErrorLoggingMiddleware: (error, req, res, next) => {
            if (error) {

                // format error for http response
                const httpError = Errors.formatHttpError(error);
                if (options.includeStackTraceInErrorResponses) {
                    httpError.stack = error.stack;
                }

                // return error
                res.status(httpError.status);
                res.json(httpError);
                return;
            }

            // no error was specified, return generic 500 error
            res.status(500);
            res.json({ message: 'Internal Server Error' });
            return;
        }
    };

};