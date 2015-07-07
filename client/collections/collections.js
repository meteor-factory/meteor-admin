var adminDeleteModalCallback;

Admin.dashboard.set('collectionWidgets', {
  template: 'mfAdminCollectionsWidgets'
});

Template.mfAdminCollectionsWidgets.onCreated(function () {
  var self = this;
  _.each(Admin.collections.get(), function (collection) {
    self.subscribe(collection.countPubName)
  });
});

Template.mfAdminCollectionsWidgets.helpers({
  background: function () {
    return (this.widget && this.widget.color) || 'blue';
  }
});

Template.mfAdminCollectionsView.onCreated(function () {
  this.subscribe(this.data.countPubName);
});

Template.mfAdminCollectionsView.helpers({
  hasDocuments: function () {
    return Counts.get(this.countPubName) > 0;
  }
});

Template.mfAdminCollectionsView.events({
  // This callback should be attached to mfAdminCollectionsDeleteBtn template
  // but for some reason templates rendered with Blaze.renderWithData are not
  // firing event callbacks
  'click .js-delete-doc': function (e, t) {
    var collection = this.table.collection;
    var _id = $(e.currentTarget).attr('data-id');

    adminDeleteModalCallback = function () {
      collection.remove(_id);
    };

    $('#admin-delete-modal').modal('show');
  }
});

Template.mfAdminCollectionsDeleteModal.events({
  'click .js-delete': function (e, t) {
    if (typeof adminDeleteModalCallback === 'function') {
      adminDeleteModalCallback();
      t.$('#admin-delete-modal').modal('hide');
    }
  },

  'hidden.bs.modal #admin-delete-modal': function (e, t) {
    adminDeleteModalCallback = null;
  }
});
