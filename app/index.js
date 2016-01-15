/**
 * Created by reharik on 8/13/15.
 */

var extend = require('extend');
var registry = require('./registry');

module.exports = function(_options) {
    var options = {
        logger: {
            moduleName: 'AppDomain'
        }
    };
    extend(options, _options || {});
    return  registry(options);
};

