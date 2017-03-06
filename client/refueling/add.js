import { Meteor } from 'meteor/meteor';
import { Refueling } from '../../imports/api/refueling.js';

var curCar = null
Template.editRefueling.onRendered(function () {
  self = this;
  this.$('.modal').modal({
    ready: function(modal, trigger) {
      curCar = trigger.data('value');
    }
  });
  this.$('.datepicker').pickadate({
    monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'
    , 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep'
    , 'Oct', 'Nov', 'Dec'],
    //Fast hack to display short days in french
    weekdaysFull: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    showWeekdaysFull: true,

    today: "Ajd",
    clear: 'Effacer',
    close: 'Fermer',

    labelMonthNext: 'Mois suivant',
    labelMonthPrev: 'Mois précédent',
    labelMonthSelect: 'Choisissez un mois',
    labelYearSelect: 'Choisissez une année',
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
    hiddenName: true,
    /*onStart: function() {
      this.set('select', Date.now())
    }*/
  });
});


Template.editRefueling.helpers({
  today() {
    return moment().format('DD/MM/YYYY');
  }
});

Template.editRefueling.events({
  'submit form': function(event) {
    event.preventDefault();
    var tpl = Template.instance()

    var refuelingDate = moment(event.target.refuelingDate.value, 'DD/MM/YYYY')
    .toDate();

    Meteor.call('refueling.insert', curCar, refuelingDate
    , parseFloat(event.target.refuelingTotal.value, 10)
    , parseFloat(event.target.refuelingPrice.value, 10)
    , parseInt(event.target.refuelingMileage.value, 10)
    , event.target.refuelingPartial.checked
    , event.target.refuelingComment.value);

    tpl.$('form').trigger("reset");
    tpl.$('#editRefueling').modal('close');
  }
});
