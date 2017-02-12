import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import '../imports/startup/accounts-config.js';


Template.intro.onRendered(function () {
  this.$('.parallax').parallax();
});


Template.menu.onRendered(function () {
  this.$(".button-collapse").sideNav();
});
