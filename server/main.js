import { Meteor } from 'meteor/meteor';
import '../imports/api/cars.js';
import '../imports/api/refueling.js';
import '../imports/api/stats.js';

Meteor.startup(() => {
  // code to run on server at startup
});
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {'createdAt': 1}});
  } else {
    this.ready();
  }
});
