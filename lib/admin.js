Admin = {
  _createRouteCallbacks: [],
  config: new ReactiveDict()
};

Admin.config.setDefault('layoutTemplate', 'mfAdminLayout');
Admin.config.setDefault('name', 'Admin');

Admin.path = function (path) {
  if (path[0] === '/') {
    return '/admin' + path;
  }
  return '/admin/' + path;
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
    layoutTemplate: Admin.config.get('layoutTemplate'),
    data: function () {
      var data = options.data ? options.data() : {};
      return _.extend({}, data, {
        content: options.template,
        contentHeader: options.contentHeader || 'mfAdminContentHeader'
      });
    }
  });
});
