/**
 * Created by rharik on 7/13/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (AggregateRootBase, eventmodels, invariant, uuid) {
    return (function (_AggregateRootBase) {
        _inherits(Trainer, _AggregateRootBase);

        function Trainer() {
            _classCallCheck(this, Trainer);

            _get(Object.getPrototypeOf(Trainer.prototype), 'constructor', this).call(this);
            var _password;
            var _loggedIn;
            var _isArchived;
            this.type = 'Trainer';
        }

        _createClass(Trainer, [{
            key: 'commandHandlers',
            value: function commandHandlers() {
                return {
                    'hireTrainer': function hireTrainer(cmd) {
                        this.raiseEvent(eventmodels.gesEvent('trainerHired', {
                            id: uuid.v4(),
                            credentials: cmd.credentials,
                            contact: cmd.contact,
                            address: cmd.address,
                            dob: cmd.dob
                        }));
                    },
                    'loginTrainer': function loginTrainer(cmd) {
                        expectNotLoggedIn();
                        expectCorrectPassword(cmd.password);
                        var token = createToken();
                        this.raiseEvent(eventmodels.gesEvent('trainerLoggedIn', {
                            id: this._id,
                            userName: cmd.userName,
                            token: token,
                            created: new Date()
                        }));
                    },
                    'archiveTrainer': function archiveTrainer(cmd) {
                        expectNotArchived();
                        this.raiseEvent(eventmodels.gesEvent('trainerArchived', {
                            id: this._id,
                            archivedDate: new Date()
                        }));
                    },
                    'unArchiveUser': function unArchiveUser(cmd) {
                        expectArchived();
                        this.raiseEvent(eventmodels.gesEvent('trainerUnarchived', {
                            id: this._id,
                            unArchivedDate: new Date()
                        }));
                    }
                };
            }
        }, {
            key: 'applyEventHandlers',
            value: function applyEventHandlers() {
                return {
                    'trainerHired': (function (event) {
                        this._password = event.password;
                        this._id = event.id;
                    }).bind(this),

                    'userArchived': (function (event) {
                        this._isArchived = true;
                    }).bind(this),

                    'userUnarchived': (function (event) {
                        this._isArchived = false;
                    }).bind(this)
                };
            }
        }, {
            key: 'createToken',
            value: function createToken() {
                return uuid.v4();
            }
        }, {
            key: 'expectCorrectPassword',
            value: function expectCorrectPassword(password) {
                invariant(password != this._password, new Error('Incorrect credentials'));
            }
        }, {
            key: 'expectNotLoggedIn',
            value: function expectNotLoggedIn() {
                invariant(_loggedIn, new Error('Trainer already logged in'));
            }
        }, {
            key: 'expectNotArchived',
            value: function expectNotArchived() {
                invariant(this._isArchived, new Error('Trainer already archived'));
            }
        }, {
            key: 'expectArchived',
            value: function expectArchived() {
                invariant(!this._isArchived, new Error('Trainer is not archived archived'));
            }
        }], [{
            key: 'aggregateName',
            value: function aggregateName() {
                return 'Trainer';
            }
        }]);

        return Trainer;
    })(AggregateRootBase);
};