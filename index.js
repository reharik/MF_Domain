/**
 * Created by reharik on 8/13/15.
 */

var Trainer = require('./src/AggregateRoots/Trainer');
var AggregateRootBase = require('./src/AggregateRoots/AggregateRootBase');

var extend = require('extend');
var registry = require('./registry');

module.exports = function(_options) {
    var options = {
        logger: {
            moduleName: 'AppDomain'
        }
    };
    extend(options, _options || {});
    var container = registry(options);
    var plugin = container.getInstanceOf('eventRepository');

    return plugin(options);
};

