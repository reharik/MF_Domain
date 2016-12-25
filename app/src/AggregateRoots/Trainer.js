/**
 * Created by rharik on 7/13/15.
 */
"use strict";

module.exports = function(AggregateRootBase, invariant, uuid) {
    return class Trainer extends AggregateRootBase {
        constructor() {
            super();
            var _password;
            var _loggedIn;
            var _isArchived;
            this.type = 'Trainer';
        }

        static aggregateName() {
            return 'Trainer';
        }

        commandHandlers() {
            return {
                'hireTrainer'   : function(cmd) {
                    this.raiseEvent({
                        eventName     : 'trainerHired',
                        data          : {
                            id         : uuid.v4(),
                            credentials: cmd.credentials,
                            contact    : cmd.contact,
                            dob        : cmd.dob,
                            color      : cmd.color
                        }
                    });
                },
                'updateTrainerInfo'   : function(cmd) {
                    this.expectNotArchived();
                    this.raiseEvent({
                        eventName     : 'trainerInfoUpdated',
                        data          : cmd
                    });
                },
                'updateTrainerContact'   : function(cmd) {
                    this.expectNotArchived();
                    this.raiseEvent({
                        eventName     : 'trainerContactUpdated',
                        data          : cmd
                    });
                },
                'updateTrainerAddress'   : function(cmd) {
                    this.expectNotArchived();
                    this.raiseEvent({
                        eventName     : 'trainerAddressUpdated',
                        data          : cmd
                    });
                },
                'updateTrainerPassword'   : function(cmd) {
                    this.expectNotArchived();
                    this.raiseEvent({
                        eventName     : 'trainerPasswordUpdated',
                        data          : cmd
                    });
                },

                'loginTrainer'  : function(cmd) {
                    expectNotLoggedIn();
                    expectCorrectPassword(cmd.password);
                    var token = createToken();
                    this.raiseEvent({
                        eventName: 'trainerLoggedIn',
                        data     : {
                            id      : this._id,
                            userName: cmd.userName,
                            token   : token,
                            created : new Date()
                        }
                    });
                },
                'archiveTrainer': function(cmd) {
                    expectNotArchived();
                    this.raiseEvent({
                        eventName: 'trainerArchived',
                        data     : {
                            id          : this._id,
                            archivedDate: new Date()
                        }
                    });
                },
                'unArchiveUser' : function(cmd) {
                    expectArchived();
                    this.raiseEvent({
                        eventName: 'trainerUnarchived',
                        data     : {
                            id            : this._id,
                            unArchivedDate: new Date()
                        }
                    });
                }
            }
        }

        applyEventHandlers() {
            return {
                'trainerHired': function(event) {
                    this._password = event.data.password;
                    this._id       = event.data.id;
                }.bind(this),

                'trainerPasswordUpdated': function(event) {
                    this._password = event.data.password;
                }.bind(this),

                'userArchived': function(event) {
                    this._isArchived = true;
                }.bind(this),

                'userUnarchived': function(event) {
                    this._isArchived = false;
                }.bind(this)
            }
        }

        createToken() {
            return uuid.v4();
        }

        expectCorrectPassword(password) {
            invariant(password != this._password,
                new Error('Incorrect credentials'));
        }

        expectNotLoggedIn() {
            invariant(_loggedIn,
                new Error('Trainer already logged in'));
        }

        expectNotArchived() {
            console.log('==========this._isArchived=========');
            console.log(this._isArchived);
            console.log('==========END this._isArchived=========');
            
            invariant(this._isArchived,
                new Error('Trainer already archived'));
        }

        expectArchived() {
            invariant(!this._isArchived,
                new Error('Trainer is not archived archived'));
        }
    }
};
