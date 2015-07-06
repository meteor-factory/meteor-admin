Admin.sidebar = new Tree();

var sidebarHelpers = {
  items: function (ctx) {
    var tree = ctx && ctx._tree ? ctx._tree : Admin.sidebar.get();
    return _.sortBy(_.values(tree), function (item) {
      return item && item.order ? item.order : 0;
    }).reverse();
  },

  hasSubItems: function (ctx) {
    return ctx && _.keys(ctx._tree).length > 0;
  },

  href: function () {
    if (this.url) {
      return this.url;
    }

    if (this.path) {
      return Admin.path(this.path);
    }

    return '#';
  }
};

Template.mfAdminSidebarItems.helpers(sidebarHelpers);
Template.mfAdminSidebarItem.helpers(sidebarHelpers);
Template.mfAdminSidebarTreeview.helpers(sidebarHelpers);
