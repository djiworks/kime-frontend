Template.menuUser.onRendered(function () {
  this.$(".button-collapse").sideNav({
    closeOnClick: true
  });
  this.$(".dropdown-button").dropdown({
    constrainWidth: false,
    belowOrigin: true
  });
});

Template.menuUser.events({
  'click [data-action="logout"]': function(event){
      event.preventDefault();
      Meteor.logout();
  }
});
