'use strict';

const FlightsApi = require('./FlightsApi');
const superAgent = require('superagent');
const ResourceConf = require('config').resource;

class ClientFactory {
    static flightsApi() {
        return new FlightsApi(ResourceConf.flights.baseUrl, superAgent);
    }
}

module.exports = ClientFactory;
