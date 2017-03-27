'use strict';

const errors = require('../modules').Errors.errors;

const ErrorDefinitions = [
    {
        name: 'AirportsNotFound',
        defaultMessage: 'Airports not found',
        defaultExplanation: 'Airports not found',
        defaultResponse: 'Airports not found'
    },
    {
        name: 'FlightsNotFound',
        defaultMessage: 'Flights not found',
        defaultExplanation: 'Flights not found',
        defaultResponse: 'Flights not found'
    }
];

ErrorDefinitions.forEach((element) => {
    errors.create(element);
});

errors
    .mapper('AirportsNotFound', (err) => {
        return new errors.Http404Error(err.message, err.explanation, err.response);
    })
    .mapper('FlightsNotFound', (err) => {
        return new errors.Http404Error(err.message, err.explanation, err.response);
    });

module.exports = errors;