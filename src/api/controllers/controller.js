'use strict';

const Facade = require('../helpers/Facade');
const Clients = require('../clients');

const controller = {

    getAirlines: (request, response, next) => {
        return controller._facade.getAirlines()
        .then((result) => {
            return response.status(200).json(result);
        })
        .catch(next);
    },

    getAirports: (request, response, next) => {
        const query = request.swagger.params.q.value;
        return controller._facade.getAirports(query)
        .then((result) => {
            return response.status(200).json(result);
        })
        .catch(next);
    },

    searchFlights: (request, response, next) => {
        const date = request.swagger.params.date.value;
        const from = request.swagger.params.from.value;
        const to = request.swagger.params.to.value;

        const params = {
            date: date,
            from: from,
            to: to
        };

        return controller._facade.flightSearch(params)
        .then((result) => {
            return response.status(200).json(result);
        })
        .catch(next);
    }
};

controller._facade = new Facade(
    Clients.flightsApi()
);

module.exports = controller;
