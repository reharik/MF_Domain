module.exports = function (AggregateRootBase, invariant, uuid, moment, moment_range) {

  return class Appointment extends AggregateRootBase {
    constructor() {
      super();
      this.type = 'Appointment';
    }

    static aggregateName() {
      return 'Appointment';
    }

    commandHandlers() {
      this.expectEndTimeAfterStart();
      this.expectAppointmentDurationCorrect();
      this.expectCorrectNumberOfClients();

      return {
        'scheduleAppointment': function (cmd) {
          this.raiseEvent({
            eventName: 'appointmentScheduled',
            data: {
              id: uuid.v4(),
              appointmentType: cmd.appointmentType,
              date: cmd.date,
              startTime: cmd.startTime,
              endTime: cmd.endTime,
              trainer: cmd.trainer,
              clients: cmd.clients,
              notes: cmd.notes
            }
          });
        }
      }
    }

    applyEventHandlers() {
      return {
        'appointmentScheduled': function (event) {
          this._id = event.data.id;
          this.appointmentType = event.data.appointmentType;
          this.startTime = event.data.startTime;
          this.endTime = event.data.endTime;
          this.trainer = event.data.trainer;
          this.clients = event.data.clients;
        }.bind(this)
      }
    }

    expectEndTimeAfterStart() {
      invariant(moment(this.startTime).after(moment(this.endTime))
        , 'Appointment End Time must be after Appointment Start Time');
    }

    expectAppointmentDurationCorrect() {
      var range = moment_range(moment(this.startTime), moment(this.endTime));
      switch (this.appointmentType) {
        case 'halfHour':
        {
          invariant(range.diff('minutes') != 30,
            'Given the Appointment Type of Half Hour the start time must be 30 minutes after the end time');
          break;
        }
        case 'fullHour':
        {
          invariant(range.diff('minutes') != 60,
            'Given the Appointment Type of Full Hour the start time must be 60 minutes after the end time');
          break;
        }
        case 'pair':
        {
          invariant(range.diff('minutes') != 60,
            'Given the Appointment Type of Pair the start time must be 60 minutes after the end time');
          break;
        }
      }
    }

    expectCorrectNumberOfClients() {
      switch (this.appointmentType) {
        case 'halfHour':
        case 'fullHour':
        {
          invariant(!clients || clients.length != 1,
            `Given the Appointment Type of ${this.appointmentType} you must have 1 and only 1 client assigned`);
          break;
        }
        case 'pair':
        {
          invariant(!clients || clients.length <= 1,
            `Given the Appointment Type of Pair you must have 2 or more clients assigned`);
          break;
        }
      }
    }
  }
};
