AutoForm.hooks({
  mfAdmin_update: {
    onSuccess: function (formType, collection) {
      Admin.go(this.template.data._successPath);
    }
  }
});
