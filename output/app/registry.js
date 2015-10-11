/**
 * Created by parallels on 9/3/15.
 */
'use strict';

var dagon = require('dagon');
var path = require('path');

module.exports = function (_options) {
    var options = _options || {};
    var container = dagon(options.dagon);
    return new container(function (x) {
        return x.pathToRoot(path.join(__dirname, '..')).requireDirectoryRecursively('./app/src').groupAllInDirectory('./app/src/AggregateRoots', 'aggregateroots')['for']('eventmodels').instantiate(function (i) {
            return i.asFunc();
        })['for']('bluebird').renameTo('Promise')['for']('corelogger').renameTo('logger').instantiate(function (i) {
            return i.asFunc().withParameters(options.logger || {});
        }).complete();
    });
};