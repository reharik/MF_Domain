/**
 * Created by reharik on 8/13/15.
 */

var container = require('../bootstrap');

module.exports = function index(options) {
    return container.getHashOfGroup('AggregateRoots');
};