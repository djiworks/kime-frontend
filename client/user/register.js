Template.userRegister.onRendered(function () {
  this.$('.modal').modal();
});

Template.userRegister.events({
  'submit form': function(event) {
    var self = Template.instance()
    event.preventDefault();
    if (event.target.passwordRegister.value !== event.target.passwordConfirmation.value) {
      return event.target.passwordConfirmation.setCustomValidity('Mot de passe différent')
    }
    var username = event.target.usernameRegister.value;
    var passwordVar = event.target.passwordRegister.value;
    Accounts.createUser({
        username: username,
        password: passwordVar
    }, function(err) {
      if (err) {
        console.error(err);
        if (err.error === 403){
          event.target.usernameRegister.setCustomValidity('Nom d\'utilisateur existant');
        }
        else {
          event.target.usernameRegister.setCustomValidity('Inscription non validé');
        }
      }
      else {
        self.$('#userRegister').modal('close');
      }
    });
  }
});
