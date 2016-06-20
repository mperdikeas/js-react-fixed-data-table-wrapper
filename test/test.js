import 'babel-polyfill';

const assert     = require('assert');

describe('some-module', function () {
    describe('some-function', function () {
        it('should work (dummy test'
           , function () {
               assert.deepEqual([1,2,3], [1,2,3]);
           });
    });
});
