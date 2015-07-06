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
  skin: function () {
    return Admin.config.get('skin');
  },

  minHeight: function () {
    return Template.instance().minHeight.get() + 'px';
  }
});
