import { Accounts } from 'meteor/accounts-base';

Template.userRegister.onRendered(function () {
  this.$('.modal').modal();
});

Template.userRegister.events({
  'submit form': function(event) {
    event.preventDefault();
    var self = Template.instance()
    event.target.register.disabled = true;
    event.target.register.classList.add('disabled');
    if (event.target.passwordRegister.value !== event.target.passwordConfirmation.value) {
      return event.target.passwordConfirmation.setCustomValidity('Mot de passe différent')
    }
    var username = event.target.usernameRegister.value;
    var passwordVar = event.target.passwordRegister.value;
    Accounts.createUser({
        username: username,
        password: passwordVar
    }, function(err) {
      event.target.register.disabled = false;
      event.target.register.classList.remove('disabled');
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
