/**
 * Created by reharik on 8/13/15.
 */

var Trainer = require('./AggregateRoots/Trainer');

module.exports = function index(options) {
    return {
        Trainer: Trainer
    }
};