FlowRouter.notFound = {
    action: function() {
      FlowRouter.go('/');
    }
};

Accounts.onLogin(function(){
  FlowRouter.go('/dashboard');
});

Accounts.onLogout(function(){
  FlowRouter.go('/');
});

FlowRouter.route('/', {
  triggersEnter: [function() {
    console.log('oo');
    if (Meteor.userId()){
      console.log('oii');
      FlowRouter.go('/dashboard');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: 'intro'});
  }
});

FlowRouter.route('/dashboard', {
  triggersEnter: [function() {
    if (!Meteor.userId()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: 'dashboard'});
  }
});

FlowRouter.route('/legal', {
  action: function() {
    BlazeLayout.render('mainLayout', {content: 'legalInfo'});
  }
});

FlowRouter.route('/profile', {
  triggersEnter: [function() {
    if (!Meteor.userId()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "userProfile"});
  }
});

FlowRouter.route('/cars', {
  triggersEnter: [function() {
    if (!Meteor.userId()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "userCars"});
  }
});

FlowRouter.route('/refueling/:cardId', {
  triggersEnter: [function() {
    if (!Meteor.userId()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "refuelingList"});
  }
});

FlowRouter.route('/stats', {
  triggersEnter: [function() {
    if (!Meteor.userId()){
      FlowRouter.go('/');
    }
  }],
  action: function() {
    BlazeLayout.render('mainLayout', {content: "statsMainView"});
  }
});
