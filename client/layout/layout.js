Template.mfAdminLayout.onCreated(function () {
  var self = this;
  self.minHeight = new ReactiveVar();
  self.resize = function () {
    self.minHeight.set(
      $(window).height() - ($('.navbar').height() || 0));
  };

  $(window).bind('resize', self.resize);
});

Template.mfAdminLayout.onRendered(function () {
  this.resize();
});

Template.mfAdminLayout.onDestroyed(function () {
  $(window).unbind('resize', this.resize);
});

Template.mfAdminLayout.helpers({
  AdminLTE_skin: function () {
    return Admin.config.get('admin-lte-skin');
  },

  AdminLTE_fixed: function () {
    return Admin.config.get('admin-lte-fixed');
  },

  AdminLTE_sidebarMini: function () {
    return Admin.config.get('admin-lte-sidebar-mini');
  },

  minHeight: function () {
    return Template.instance().minHeight.get() + 'px';
  },

  contentData: function () {
    var routeOptions = Admin._currentRouteOptions();
    return routeOptions && routeOptions.data &&
      routeOptions.data(Admin._routeParams());
  }
});
