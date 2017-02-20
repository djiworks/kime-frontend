import { Cars } from '../../imports/api/cars.js';

Template.userCars.helpers({
  count() {
    return Cars.find({}).count();
  },
  cars() {
    return Cars.find({});
  }
});

Template.userCar.helpers({
  motor() {
    switch (this.motor_type) {
      case 0:
        return 'Diesel';
        break;
      case 1:
        return 'Essence';
        break;
      default:
        return 'Inconnu';
    }
  }
});
