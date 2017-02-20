Template.userLogin.onRendered(function () {
  this.$('.modal').modal();
});

Template.userLogin.events({
  'submit form': function(event) {
    event.preventDefault();
    Meteor.loginWithPassword(
      event.target.username.value,
      event.target.password.value,
      function(err){
        if(err) {
          event.target.username.setCustomValidity('Identifiant ou mot de passe incorrect');
          console.error(err);
        }
        else {
          Template.instance().$('#userLogin').modal('close');
        }
    });
  }
});
