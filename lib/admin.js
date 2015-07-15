Admin = {
  _createRouteCallbacks: [],
  config: new ReactiveDict()
};

Admin.config.setDefault('layoutTemplate', 'mfAdminLayout');
Admin.config.setDefault('name', 'Admin');

Admin.isAdmin = function (userId) {
  if (Package['alanning:roles']) {
    return Roles.userIsInRole(userId, ['admin']);
  }

  return false;
};

Admin.path = function (path) {
  path = path || '';
  if (path[0] === '/') {
    return '/admin' + path;
  }
  return '/admin/' + path;
};

Admin.go = function (path) {
  var Router = Package['iron:router'] && Package['iron:router'].Router;
  if (Router) {
    return Router.go(Admin.path(path));
  }
};

Admin.route = function (path, options) {
  path = Admin.path(path);
  _.each(Admin._createRouteCallbacks, function (cb) {
    cb(path, options);
  });
};

Admin.onRouteCreate = function (cb) {
  if (typeof cb === 'function') {
    Admin._createRouteCallbacks.push(cb);
  }
};

Admin.onRouteCreate(function (path, options) {
  var Router = Package['iron:router'] && Package['iron:router'].Router;
  if (! Router) {
    return;
  }

  Router.route(path, {
    layoutTemplate: options.layoutTemplate || Admin.config.get('layoutTemplate'),
    onBeforeAction: function () {
      if (! Admin.isAdmin(Meteor.userId())) {
        Router.go(Admin.path('/login'));
      }
      this.next();
    },
    data: function () {
      var data = options.data ? options.data(this.params) : {};
      return _.extend({}, data, {
        content: options.template,
        contentHeader: options.contentHeader || 'mfAdminContentHeader'
      });
    }
  });
});

Admin.route('/login', {
  template: 'mfAdminLogin',
  layoutTemplate: 'mfAdminLoginLayout'
});
