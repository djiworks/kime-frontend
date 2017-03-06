import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
export const Refueling = new Mongo.Collection('refueling');
const Cars = Mongo.Collection.get('cars')

function toFixed(value) {
  return Number(value.toFixed(2));
}

if (Meteor.isServer) {
  Meteor.methods({
    'refueling.removeByCar'(carId) {
      check(carId, String);

      const car = Cars.findOne(carId)
      if (! car) {
        throw new Meteor.Error('refueling_car-not-found');
      }

      if (car.ownerId !== this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Refueling.remove({carId: carId});
    },

    'refueling.insert'(carId, rDate, total, price, mileage, partial, comment) {
      if (! rDate instanceof Date) {
        throw new Meteor.Error('wrong-date-arg');
      }

      check(carId, String);
      check(total, Number);
      check(price, Number);
      check(mileage, Number);
      check(partial, Boolean);
      check(comment, String);

      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      const car = Cars.findOne(carId)
      if (! car) {
        throw new Meteor.Error('refueling_car-not-found');
      }

      if (Refueling.find({ownerId: this.userId}).count() >= 10) {
        throw new Meteor.Error('refueling_quota-leak');
      }

      var oldMileage = Refueling.findOne({carId: carId}
      , {sort: {date: -1, limit: 1}});

      if (oldMileage) {
        oldMileage = oldMileage.new_mileage
      }
      else {
        oldMileage = car.start_mileage
      }

      if (oldMileage >= mileage) {
        throw new Meteor.Error('refueling_wrong_mileage');
      }

      var volume = toFixed(total / price)
      var distance = (mileage - oldMileage)
      var consumption = toFixed((100 * volume) / distance)
      Refueling.insert({
        date: rDate,
        total: toFixed(total),
        price: toFixed(price),
        comment: comment,
        partial: partial,
        carId: carId,
        ownerId: this.userId,
        new_mileage: mileage,
        old_mileage: oldMileage,

        //Computed values
        volume: volume,
        distance: distance,
        consumption: consumption
      });
    }
  });

  Meteor.publish('refueling', function refuelingPublication(carId) {
    query = {ownerId: this.userId}
    if(carId) {
      query['carId'] = carId
    }
    return Refueling.find(query);
  });
}
