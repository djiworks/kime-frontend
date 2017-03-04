FlowRouter.notFound = {
    action: function() {
      FlowRouter.go('/');
    }
};

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('mainLayout', {content: 'dashboard'});
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

FlowRouter.route('/refueling/:cardId', {
  triggersEnter: [function() {
    if (!Meteor.user()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "refuelingList"});
  }
});

FlowRouter.route('/stats', {
  triggersEnter: [function() {
    if (!Meteor.user()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "statsMainView"});
  }
});
