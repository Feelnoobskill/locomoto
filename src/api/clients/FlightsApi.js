'use strict';

module.exports = class FlightsApi {

    constructor(assetResourceBaseUrl, agent) {
        this.agent = agent;
        this.baseUrl = assetResourceBaseUrl;
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    _handleResponse(resolve, reject) {
        return (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res.body);
        };
    }

    _request(method, url) {
        const request = this.agent[method](url || this.baseUrl).set(this.headers);
        return request;
    }

    getAirlines() {
        const url = `${this.baseUrl}/code-task/airlines`;
        return new Promise((resolve, reject) => {
            this._request('get', url)
                .end(this._handleResponse(resolve, reject));
        })
    }

    getAirports(query) {
        const url = `${this.baseUrl}/code-task/airports`;
        return new Promise((resolve, reject) => {
            this._request('get', url)
                .query({ q: query })
                .end(this._handleResponse(resolve, reject));
        })
    }

    flightSearch(code, params) {
        const url = `${this.baseUrl}/code-task/flight_search/${code}`;
        return new Promise((resolve, reject) => {
            this._request('get', url)
                .query(params)
                .end(this._handleResponse(resolve, reject));
        })
    }

}
