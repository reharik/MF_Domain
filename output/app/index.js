/**
 * Created by reharik on 8/13/15.
 */

'use strict';

var extend = require('extend');
var registry = require('./registry');

module.exports = function (_options) {
    var options = {
        logger: {
            moduleName: 'AppDomain'
        }
    };
    extend(options, _options || {});
    var container = registry(options);
    return container.getHashOfGroup('aggregateroots');
};