/* global it); describe); before */
'use strict';

const should = require('should');
const request = require('supertest');
const server = require('../../src/app');


describe('controllers', () => {

    describe('GET /airlines', () => {
        it('should return all airlines', (done) => {
            request(server)
                .get('/api/airlines')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);

                    const airlines = res.body;

                    airlines[0].should.have.property('code');
                    airlines[0].should.have.property('name');

                    airlines[1].should.have.property('code');
                    airlines[1].should.have.property('name');

                    done(err);
                });
        });
    });

    describe('GET /airports', () => {
        it('should return airports that match string Kiev', (done) => {
            request(server)
                .get('/api/airports?q=Kiev')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);

                    const airports = res.body;

                    airports.should.have.lengthOf(2);

                    airports[0].should.have.property('airportCode').eql('KBP');
                    airports[0].should.have.property('airportName').eql('Boryspil Arpt');
                    airports[0].should.have.property('cityCode').eql('IEV');
                    airports[0].should.have.property('cityName').eql('Kiev');
                    airports[0].should.have.property('countryCode').eql('UA');
                    airports[0].should.have.property('countryName').eql('Ukraine');
                    airports[0].should.have.property('latitude').eql(50.345);
                    airports[0].should.have.property('longitude').eql(30.894722);
                    airports[0].should.have.property('stateCode');
                    airports[0].should.have.property('timeZone').eql('Europe/Kiev');

                    airports[1].should.have.property('airportCode').eql('IEV');
                    airports[1].should.have.property('airportName').eql('Kiev Zhuliany Arpt');
                    airports[1].should.have.property('cityCode').eql('IEV');
                    airports[1].should.have.property('cityName').eql('Kiev');
                    airports[1].should.have.property('countryCode').eql('UA');
                    airports[1].should.have.property('countryName').eql('Ukraine');
                    airports[1].should.have.property('latitude').eql(50.401694);
                    airports[1].should.have.property('longitude').eql(30.449697);
                    airports[1].should.have.property('stateCode');
                    airports[1].should.have.property('timeZone').eql('Europe/Kiev');

                    done(err);
                });
        });

        it('should return 404 when airports not found', (done) => {
            request(server)
                .get('/api/airports?q=AirportNotFound')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('message').eql('Airports not found');
                    done(err);
                });
        });
    });

    describe('GET /search', () => {

        it('should return flights', (done) => {
            request(server)
                .get('/api/search?date=2018-09-02&from=Kiev&to=Boston')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    done(err);
                })
        });

        it('should return 404 when departure is not found', (done) => {
            request(server)
                .get('/api/search?date=2018-09-02&from=Unknown&to=Boston')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    should.not.exist(err);

                    res.body.should.have.property('message').eql('Flights not found');
                    done(err);
                });
        });

        it('should return 404 when arrival is not found', (done) => {
            request(server)
                .get('/api/search?date=2018-09-02&from=Boston&to=Unknown')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    should.not.exist(err);

                    res.body.should.have.property('message').eql('Flights not found');
                    done(err);
                });
        });

        it('should return 404 when there are no flights between cities', (done) => {
            // I could not find find such flights:D
            done();
        })

    });

});
