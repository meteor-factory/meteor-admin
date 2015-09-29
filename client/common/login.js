Template.mfAdminLogin.helpers({
  serviceTemplate: function () {
    var loginLayoutTemplate = Admin.config.get('loginLayoutTemplate');

    if (loginLayoutTemplate){
      return loginLayoutTemplate;
    }

    if (Package['useraccounts:bootstrap']) {
      return 'mfAdminLoginUseraccountsBootstrap'
    };

    if (Package['accounts-ui']) {
      return 'mfAdminLoginAccountsUI';
    }

    throw new Error('Missing template for login page.');
  },

  data: function () {
    return {
      redirectPath: Admin.path()
    };
  }
});

Template.mfAdminLogin.onCreated(function () {
  this.autorun(function () {
    var user = Meteor.user();
    if (Admin.isAdmin(Meteor.userId())) {
      Admin.go('/');
    }
  });
});
