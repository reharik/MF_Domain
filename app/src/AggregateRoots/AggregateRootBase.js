/**
 * Created by reharik on 6/8/15.
 */

"use strict";

module.exports = function(invariant) {
    return class AggregateRootBase {
        constructor() {
            this._id;
            this._version          = -1; // corresponds to ExpectedEvent.NoStream
            this.uncommittedEvents = [];

            invariant(
                this.commandHandlers,
                'An aggregateRoot requires commandHandlers'
            );
            invariant(
                this.applyEventHandlers,
                'An aggregateRoot requires applyEventHandlers'
            );

            Object.assign(this, this.commandHandlers());
        }

        applyEvent(event) {
        console.log('==========event in apply event agg root=========');
        console.log(event);
        console.log('==========END event=========');
            var eventHandlers = this.applyEventHandlers();
            var key = Object.keys(eventHandlers).find(x => x === event.eventName );
            if (key) {
                console.log('==========key=========');
                console.log(key);
                console.log('==========END key=========');
                console.log('==========this.applyEventHandlers()=========');
                console.log(eventHandlers);
                console.log('==========END this.applyEventHandlers()=========');

                eventHandlers[key](event);
            }
            this._version++;
        }

        raiseEvent(event) {
            this.applyEvent(event);
            this.uncommittedEvents.push(event);
        }

        getUncommittedEvents() {
            return this.uncommittedEvents;
        }

        clearUncommittedEvents() {
            this.uncommittedEvents = [];
        }

        static isAggregateBase() {
            return true;
        }

        isAggregateBase() {
            return true;
        }
    }
};
