import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
export const Cars = new Mongo.Collection('cars');

Meteor.methods({
  'cars.insert'(name, type, mileage) {
    check(name, String);
    check(type, Number);
    check(mileage, Number);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Cars.find({ownerId: this.userId}).count() >= 2) {
      throw new Meteor.Error('cars_quota-leak');
    }

    Cars.insert({
      name: name,
      motor_type: type,
      start_mileage: mileage,
      ownerId: this.userId
    });
  },

  'cars.remove'(carId) {
    check(carId, String);
    Cars.remove(carId);
  }
});
