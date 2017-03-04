import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Refueling = Mongo.Collection.get('refueling')

if (Meteor.isServer) {
  Meteor.methods({
    'dashboard.get'() {
      const user = this.userId
      if (! user) {
        throw new Meteor.Error('not-authorized');
      }

      // Get month date range
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return Refueling.aggregate([{
        $match: {
          ownerId: user,
          date: {$gte: firstDay, $lt: lastDay},
          partial: false
        }
      },{
        $group: {
          _id: null,
          avgDistance: {$avg: "$distance"},
          avgConso: {$avg: "$consumption"},
          avgTotal: {$avg: "$total"},

          sumVolume: {$sum: "$volume"},
          sumTotal: {$sum: "$total"},
          sumDistance: {$sum: "$distance"}
        }
      },{
        $project: {
          avgDistance: 1,
          avgConso: 1,
          avgTotal: 1,
          sumVolume: 1,
          sumTotal: 1,
          sumDistance: 1,
          costUnit: { $divide: [ "$sumTotal", "$sumDistance" ]}
        }
      }]);
    },

    'stats.getCommonData'(carId, month, year) {
      this.unblock();
      const user = this.userId
      if (! user) {
        throw new Meteor.Error('not-authorized');
      }
      var query = {'doc.ownerId': this.userId, 'doc.partial': false}
      var group = {carId: '$doc.carId'}
      var label = null
      var sort = null
      if(carId) {
        query['doc.carId'] = carId
      }

      var dateProject = {doc: "$$ROOT"}
      if(month) {
        dateProject['month'] = { $month: "$date" };
        query['month'] = month;
      }
      if(year) {
        dateProject['year'] = { $year: "$date" }
        query['year'] = year;
      }

      // Year + Month => x axis is days
      if(year && month) {
        group['day'] = { $dayOfMonth: "$doc.date" }
        label = [{ $substr: [ "$_id.day", 0, -1 ] }]
        sort = {"_id.day": 1}
      }
      else {
        // Only month => x axis is month + year
        if(month && !year){
          group['month'] = { $month: "$doc.date" }
          group['year'] = { $year: "$doc.date" }
          label = [{ $substr: [ "$_id.month", 0, -1 ] }, "/", { $substr: [ "$_id.year", 0, -1 ] }]
          sort = {"_id.year": 1, "_id.month": 1}
        }
        else {
          // Only year => x axis is month
          if(!month && year){
            group['month'] = { $month: "$doc.date" }
            label = [{ $substr: [ "$_id.month", 0, -1 ] }]
            sort = {"_id.month": 1}
          }
          // Neither month nor year => x axis is year
          else {
            group['year'] = { $year: "$doc.date" }
            label = [{ $substr: [ "$_id.year", 0, -1 ] }]
            sort = {"_id.year": 1}
          }
        }
      }

      return Refueling.aggregate([{
        $project: dateProject
      }, {
        $match: query
      }, {
        $group: {
          _id: group,
          distance: {$sum: "$doc.distance"},
          volume: {$sum: "$doc.volume"},
          consumption: {$avg: "$doc.consumption"},
          expense: {$sum: "$doc.total"}
        }
      }, {
        $project: {
          label: {$concat: label},
          distance: 1,
          consumption: 1,
          expense: 1,
          costUnit: { $divide: [ "$expense", "$distance" ]},
          distcost: { $divide: [ "$distance", "$expense" ]},
          distliter: { $divide: [ "$distance", "$volume" ]},
          carId: {$concat: ["$_id.carId"]}
        }
      }, {
        $sort: sort
      }]);
    }
  });
}
