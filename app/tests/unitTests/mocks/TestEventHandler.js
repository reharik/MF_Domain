/**
 * Created by rharik on 6/19/15.
 */

module.exports = function() {
    return class TestEventHandler {
        constructor() {
            this.handlesEvents = ['someEventNotificationOn',
                'someEventNotificationOff',
                'someExceptionNotificationOn',
                'someExceptionNotificationOff',
                'testingEventNotificationOn',
                'testingEventNotificationOff'];
            this.eventsHandled = [];
            this.eventHandlerName = 'TestEventHandler';
        }
        handleEvent(vent){
            this.eventsHandled.push(vent);
        }
        clearEventsHandled(){
            this.eventsHandled = [];
        }
        getHandledEvents(){
            return this.eventsHandled;
        }


    };
};
