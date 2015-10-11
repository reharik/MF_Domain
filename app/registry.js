/**
 * Created by parallels on 9/3/15.
 */
var dagon = require('dagon');
var path = require('path');

module.exports = function(_options) {
    var options = _options || {};
    var container = dagon(options.dagon);
    return new container(x=>
        x.pathToRoot(path.join(__dirname,'..'))
            .requireDirectoryRecursively('./app/src')
            .groupAllInDirectory('./app/src/AggregateRoots', 'aggregateroots')
            .for('eventmodels').instantiate(i=>i.asFunc())
            .for('bluebird').renameTo('Promise')
            .for('corelogger').renameTo('logger').instantiate(i=>i.asFunc().withParameters(options.logger || {}))
            .complete());
};
