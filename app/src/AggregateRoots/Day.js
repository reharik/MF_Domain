module.exports = function(AggregateRootBase, invariant, uuid, moment) {
    return class Day extends AggregateRootBase {
        constructor() {
            super();
            this.type = 'Day';
            this.appointments = [];
        }

        static aggregateName() {
            return 'Day';
        }

        getNewAppointmentId(startTime, endTime, trainer) {
            var item = this.appointments.find(x => 
            x.startTime === startTime
            && x.endTime === endTime
            && x.trainer === trainer);
            return item ? item.id : undefined;
        }

        commandHandlers() {
            return {
                'scheduleAppointment': function (cmd) {
                    this.expectEndTimeAfterStart(cmd);
                    this.expectAppointmentDurationCorrect(cmd);
                    this.expectCorrectNumberOfClients(cmd);
                    this.expectTrainerNotConflicting(cmd);
                    this.expectClientsNotConflicting(cmd);

                    this.raiseEvent({
                        eventName: 'appointmentScheduled',
                        data: {
                            id: uuid.v4(),
                            appointmentType: cmd.appointmentType,
                            date: cmd.date,
                            startTime: cmd.startTime,
                            endTime: cmd.endTime,
                            trainer: cmd.trainer,
                            trainerName: cmd.trainerName,
                            clients: cmd.clients,
                            notes: cmd.notes,
                            localDate: cmd.entityName
                        }
                    });
                }.bind(this)
            }
        }

        applyEventHandlers() {
            return {
                'appointmentScheduled': function (event) {
                    if(!this._id){
                        this._id = event.localDate;
                    }
                    this.appointments.push({
                        id: event.id,
                        appointmentType: event.appointmentType,
                        startTime: event.startTime,
                        endTime: event.endTime,
                        trainer: event.trainer,
                        clients: event.clients
                    });
                }.bind(this)
            }
        }

        expectEndTimeAfterStart(cmd) {
            console.log('==========cmd=========');
            console.log(cmd);
            console.log('==========END cmd=========');
            console.log('==========moment(cmd.endTime).isAfter(moment(cmd.startTime))=========');
            console.log(moment(cmd.endTime).isAfter(moment(cmd.startTime)));
            console.log('==========END moment(cmd.endTime).isAfter(moment(cmd.startTime))=========');
            
            invariant(moment(cmd.endTime).isAfter(moment(cmd.startTime))
              , 'Appointment End Time must be after Appointment Start Time');
        }

        expectAppointmentDurationCorrect(cmd) {
            var diff = moment(cmd.endTime).diff(moment(cmd.startTime), 'minutes');
            switch (cmd.appointmentType) {
                case 'halfHour':
                {
                    invariant(diff === 30,
                        'Given the Appointment Type of Half Hour the start time must be 30 minutes after the end time');
                    break;
                }
                case 'fullHour':
                {
                    invariant(diff === 60,
                        'Given the Appointment Type of Full Hour the start time must be 60 minutes after the end time');
                    break;
                }
                case 'pair':
                {
                    invariant(diff === 60,
                        'Given the Appointment Type of Pair the start time must be 60 minutes after the end time');
                    break;
                }
            }
        }

        expectCorrectNumberOfClients(cmd) {
            switch (cmd.appointmentType) {
                case 'halfHour':
                case 'fullHour':
                {
                    invariant(cmd.clients && cmd.clients.length === 1,
                        `Given the Appointment Type of ${cmd.appointmentType} you must have 1 and only 1 client assigned`);
                    break;
                }
                case 'pair':
                {
                    invariant(cmd.clients && cmd.clients.length >= 2,
                        `Given the Appointment Type of Pair you must have 2 or more clients assigned`);
                    break;
                }
            }
        }

        expectTrainerNotConflicting(cmd) {
            var trainerConflict = this.appointments.filter(x=>
                moment(x.startTime).isBetween(cmd.startTime, cmd.endTime, 'minutes')
                || moment(x.endTime).isBetween(cmd.startTime, cmd.endTime, 'minutes'))
                .filter( x=> x.trainer.id === cmd.trainer.id);
            console.log('==========trainerConflict=========');
            console.log(trainerConflict);
            console.log('==========END trainerConflict=========');
            invariant(trainerConflict.length <= 0, `New Appointment conflicts with this Appointment: ${trainerConflict[0].id} 
                for this trainer: ${cmd.trainer}.`);
        }

        expectClientsNotConflicting(cmd) {
            var clientConflicts = this.appointments.filter(x =>
            moment(x.startTime).isBetween(cmd.startTime, cmd.endTime, 'minutes')
            || moment(x.endTime).isBetween(cmd.startTime, cmd.endTime, 'minutes'))
                .filter(x => x.clients.some(c => cmd.clients.some(c2 => c.id === c2.id)));
            invariant(clientConflicts.length <= 0, `New Appointment conflicts with this Appointment: ${clientConflicts[0].id} 
                for at least one client.`);
        }
    }
};
