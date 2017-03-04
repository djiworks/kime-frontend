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

  //TODO REMOVE this
  //'giwc4axhi2MkyScLe'
  //Meteor.call('stats.getCommonData', null, null,  null);
  //Meteor.call('stats.getCommonData', 'giwc4axhi2MkyScLe', null, 2017, function(err, data) {
  //  console.log(data);
  //});
  //Meteor.call('stats.getCommonData', null, 2, null);
  //Meteor.call('stats.getCommonData', null, null, 2017);

  //Meteor.call('stats.getCommonData', carid, 2, null);
  //Meteor.call('stats.getCommonData', carid, null, 2017);

  //Meteor.call('stats.getCommonData', null, 2, 2017);
  //Meteor.call('stats.getCommonData', carid, 2, 2017);
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


function isInt(n) {
   return n % 1 === 0;
}

Template.dashboardItem.helpers({
  numberFixed: function() {
      if (isInt(this.number)) {
        return this.number;
      }
      else {
        return this.number.toFixed(2);
      }
  }
});
