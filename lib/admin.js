Admin = {
  _createRouteCallbacks: [],
  _routeOptions: {},
  config: new ReactiveDict()
};

Admin.config.setDefault('loginLayoutTemplate', undefined);
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
  var IronRouter = Package['iron:router'] && Package['iron:router'].Router;
  var FlowRouter = Package['kadira:flow-router'] &&
                   Package['kadira:flow-router'].FlowRouter;
  if (IronRouter)
    return IronRouter.go(Admin.path(path));
  if (FlowRouter)
    return FlowRouter.go(Admin.path(path));
};

Admin.route = function (path, options) {
  path = Admin.path(path);
  _.each(Admin._createRouteCallbacks, function (cb) {
    cb(path, options);
  });
};

Admin._currentRouteOptions = function () {
  if (!!Package['iron:router']) {
    return Admin._routeOptions[Router.current().route.getName()];
  }
  if (!!Package['kadira:flow-router']) {
    return Admin._routeOptions[FlowRouter.current().route.name];
  }
};

Admin._routeParams = function () {
  if (!!Package['iron:router']) {
    var params = Router.current().params;
    return _.pick(params, _.without(_.keys(params), 'hash', 'query'));
  }
  if (!!Package['kadira:flow-router']) {
    return FlowRouter.current().params;
  }
};

Admin.onRouteCreate = function (cb) {
  if (typeof cb === 'function') {
    Admin._createRouteCallbacks.push(cb);
  }
};

Admin.onRouteCreate(function (path, options) {
  var IronRouter = Package['iron:router'] && Package['iron:router'].Router;
  var FlowRouter = Package['kadira:flow-router'] &&
                   Package['kadira:flow-router'].FlowRouter;
  if (!(IronRouter || FlowRouter))
    throw new Error(
      'mfactory:admin requires kadira:flow-router or iron:router to be installed');


  var data = {
    content: options.template,
    contentHeader: options.contentHeader || 'mfAdminContentHeader',
    _path: path
  };

  Admin._routeOptions[path] = options;

  if (IronRouter)
    createIronRoute(IronRouter, path, data);
  if (FlowRouter && Meteor.isClient)
    createFlowRoute(FlowRouter, path, data);
});

function createIronRoute(router, path, data) {
  router.route(path, {
    name: path,
    layoutTemplate: data.layoutTemplate || Admin.config.get('layoutTemplate'),
    onBeforeAction: function () {
      if (!Admin.isAdmin(Meteor.userId()))
        return Admin.go(Admin.path('/login'));
      this.next();
    },
    data: { content: data.content }
  });
};

function createFlowRoute(router, path, data) {
  var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
  router.route(path, {
    name: path,
    action: function () {
      if (!Admin.isAdmin(Meteor.userId()))
        return Admin.go(Admin.path('/login'));
      BlazeLayout.render(
        data.layoutTemplate || Admin.config.get('layoutTemplate'),
        { content: data.content });
    }
  });
}

Admin.route('/login', {
  template: 'mfAdminLogin',
  layoutTemplate: 'mfAdminLoginLayout'
});
