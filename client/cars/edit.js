import { Cars } from '../../imports/api/cars.js';

Template.editCar.onRendered(function () {
  this.$('.modal').modal();
  this.$('select').material_select();
});


Template.editCar.events({
  'submit form': function(event) {
    event.preventDefault();
    Cars.insert({
      name: event.target.carName.value,
      motor_type: parseInt(event.target.carMotor.value, 10),
      start_mileage: parseInt(event.target.carMileage.value, 10),
      ownerId: Meteor.userId()
    });
    var tpl = Template.instance()
    tpl.$('form').trigger("reset");
    tpl.$('#editCar').modal('close');
  }
});
