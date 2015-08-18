/**
 * Created by reharik on 8/13/15.
 */

var Trainer = require('./AggregateRoots/Trainer');
var AggregateRootBase = require('./AggregateRoots/AggregateRootBase');

module.exports = function index(options) {
    return {
        AggregateRootBase:AggregateRootBase,
        Trainer: Trainer
    }
};