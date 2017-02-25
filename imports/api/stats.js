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
    }
  });
}
