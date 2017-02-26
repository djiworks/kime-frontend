import { Refueling } from '../../imports/api/refueling.js';

Template.refuelingList.onCreated(function () {
  this.subscribe('refueling', FlowRouter.current().params['cardId']);
});

Template.refuelingList.helpers({
  carId() {
    return FlowRouter.current().params['cardId']
  },

  carName() {
    return FlowRouter.current().queryParams['name']
  },

  refueling() {
    return Refueling.find({},{sort: {date: -1}});
  },

  formatDate() {
    return moment(this.date).format('DD/MM/YYYY')
  }
});
