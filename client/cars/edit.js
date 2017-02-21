import { Meteor } from 'meteor/meteor';
import { Cars } from '../../imports/api/cars.js';

Template.editCar.onRendered(function () {
  this.$('.modal').modal();
  this.$('select').material_select();
});


Template.editCar.events({
  'submit form': function(event) {
    event.preventDefault();
    Meteor.call('cars.insert', event.target.carName.value
    , parseInt(event.target.carMotor.value, 10)
    , parseInt(event.target.carMileage.value, 10));

    var tpl = Template.instance()
    tpl.$('form').trigger("reset");
    tpl.$('#editCar').modal('close');
  }
});
