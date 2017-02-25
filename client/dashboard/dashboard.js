import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Cars } from '../../imports/api/cars.js';
import { Refueling } from '../../imports/api/refueling.js';

Template.dashboard.onCreated(function () {
  Meteor.call('dashboard.get', function(err, data){
    // Take 0 because of aggregate result format
    Session.set('dashboard_data', data[0]);
  });
  this.subscribe('cars');
  this.subscribe('refueling');
});


Template.dashboard.helpers({
  dataDashboard: function() {
    return Session.get('dashboard_data');
  },
  startDate: function() {
    var date = new Date();
    return moment(new Date(date.getFullYear(), date.getMonth(), 1))
    .format('DD/MM/YYYY');
  },
  endDate: function() {
    var date = new Date();
    return moment(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    .format('DD/MM/YYYY');;
  },
  carsCount: function() {
    return (Cars.find({}).count() * 100 / 2);
  },
  refuelingCount: function() {
    return (Refueling.find({}).count() * 100 / 10);
  }
});
