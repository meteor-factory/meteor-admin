Template.mfAdminLogin.helpers({
  serviceTemplate: function () {
    if (Package['useraccounts:bootstrap']) {
      return 'mfAdminLoginUseraccountsBootstrap'
    };

    if (Package['accounts-ui']) {
      return 'mfAdminLoginAccountsUI';
    }
  },

  data: function () {
    return {
      redirectPath: Admin.path()
    };
  }
});

Template.mfAdminLoginAccountsUI.onCreated(function () {
  this.autorun(function () {
    if (Admin.isAdmin(Meteor.userId())) {
      Admin.go('/');
    }
  });
});
