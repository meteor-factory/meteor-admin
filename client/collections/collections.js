Admin.dashboard.set('collectionWidgets', {
  template: 'mfAdminCollectionsWidgets'
});

Template.mfAdminCollectionsWidgets.onCreated(function () {
  var self = this;
  _.each(Admin.collections.get(), function (collection) {
    self.subscribe(collection.countPubName)
  });
});
