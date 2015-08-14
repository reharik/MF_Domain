/**
 * Created by reharik on 8/13/15.
 */

var Container = require('dagon');
module.exports = new Container(x=>
    x.pathToRoot(__dirname)
        .requireDirectoryRecursively('./src')
        .groupAllInDirectory('./src/AggregateRoots', 'AggregateRoots')
        .complete());