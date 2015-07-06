var DashboardImpl = function () {
  this._items = {};
  this._dep = new Tracker.Dependency();
};

DashboardImpl.prototype.set = function (key, value) {
  this._items[key] = value;
  this._dep.changed();
};

DashboardImpl.prototype.getSorted = function () {
  this._dep.depend();
  return _.sortBy(_.values(this._items), function (item) {
    return item.order || 0;
  });
};

Admin.dashboard = new DashboardImpl();

Template.mfAdminDashboard.helpers({
  items: function () {
    return Admin.dashboard.getSorted();
  }
});
