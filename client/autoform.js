AutoForm.hooks({
  mfAdmin_insert: {
    onSuccess: function (formType, collection) {
      Admin.go(this.template.data._successPath);
    }
  },

  mfAdmin_update: {
    onSuccess: function (formType, collection) {
      Admin.go(this.template.data._successPath);
    }
  }
});
