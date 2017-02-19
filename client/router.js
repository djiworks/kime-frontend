FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('mainLayout', {content: ''});
  }
});

FlowRouter.route('/profile', {
  triggersEnter: [function() {
    if (!Meteor.user()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "userProfile"});
  }
});


FlowRouter.route('/cars', {
  triggersEnter: [function() {
    if (!Meteor.user()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "userCars"});
  }
});
