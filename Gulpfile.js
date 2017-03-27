'use strict';
require('shelljs/global');
const gulp = require('gulp');

/**
 * Run eslint for javascript files
 * @param done
 */

function eslintJs(done) {
    const command = './node_modules/.bin/eslint ./src; exit 0';
    const exitCode = exec(command).code;
    if (exitCode === 0) {
        done();
    } else {
        console.log('ESLINT found Errors. Continuing...');
        done();
    }
}

/**
 * Run unit tests using the mocha test runner
 * @param done
 */
function mochaTest(done) {
    const command = 'NODE_ENV=test ./node_modules/mocha/bin/mocha --reporter spec --timeout 15000 test/**/*.test.js';

    const exitCode = exec(command).code;

    if (exitCode === 0) {
        done();
    } else {
        done('Unit tests failed');
    }
}

/**
 * Start the express app
 * @param done
 */
function startServer(done) {
    const command = 'NODE_ENV=development ./node_modules/.bin/nodemon ./src/app.js';
    exec(command);
    done();
}

// Gulp Wireup
gulp.task('serve', startServer);
gulp.task('lint::js', eslintJs);

gulp.task('test::mocha', mochaTest);
gulp.task('test::unit', gulp.parallel('lint::js', 'test::mocha'));
gulp.task('test', gulp.series('test::unit'));