'use strict';

const Errors = require('./errors');

class Facade {
    constructor(flightsApi) {
        this.flightsApi = flightsApi;
    }

    getAirlines() {
        return this.flightsApi.getAirlines();
    }

    getAirports(query) {
        return this.flightsApi.getAirports(query)
        .then((result) => {
            if (! result.length) {
                return Promise.reject(new Errors.AirportsNotFound());
            } else {
                return Promise.resolve(result);
            }
        });
    }

    flightSearch(params) {
        return this.flightsApi.getAirlines()
        .then((airlines) => {
            return Promise.all([
                this.flightsApi.getAirports(params.from),
                this.flightsApi.getAirports(params.to)
            ])
            .then((result) => {
                const airportsFrom = result[0],
                    airportsTo = result[1];

                if (! airportsFrom.length || ! airportsTo.length) {
                    return Promise.reject(new Errors.FlightsNotFound());
                }

                const searchFlights = [];
                airlines.map((airline) => {
                    airportsFrom.map((from) => {
                        airportsTo.map((to) => {
                            const search = {
                                date: params.date,
                                from: from.airportCode,
                                to: to.airportCode
                            };
                            searchFlights.push({ code: airline.code, params: search });
                        });
                    });
                });

                const search = searchFlights.map((data) => {
                    return this.flightsApi.flightSearch(data.code, data.params);
                });

                return Promise.all(search);
            })
            .then((result) => {
                const flights = [];
                result.map((items) => {
                    items.map((item) => {
                        flights.push(item);
                    });
                });

                if (! flights.length) {
                    return Promise.reject(new Errors.FlightsNotFound());
                }

                return Promise.resolve(flights);
            })
        });

    }
}

module.exports = Facade;