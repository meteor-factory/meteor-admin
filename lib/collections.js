Admin.collections = {
  _collections: {},
  _dep: new Tracker.Dependency()
};

var lookupCollection = function (obj, root) {
  root = root || (Meteor.isServer ? global : window);
  if (typeof obj === 'string') {
    var ref = root;
    var arr = obj.split('.');
    while (arr.length && (ref = ref[arr.shift()])) {
      continue;
    }
    if (! ref) {
      throw new Error(obj + ' is not in the ' + root.toString());
    }
    return ref;
  }
  return obj;
};

var getCollectionColumns = function (collection) {
  if (collection && collection._c2 && collection._c2._simpleSchema) {
    return _.map(collection._c2._simpleSchema._schemaKeys, function (key) {
      return { data: key, title: key };
    });
  }

  return [{ data: '_id', title: 'ID' }];
}

Admin.collections.add = function (name, options) {
  var viewPath = '/' + name;
  var newPath = '/' + name + '/new';
  var countPubName = 'mfAdmin-' + name + '-count';
  var collection = lookupCollection(name);
  var icon = options.icon || 'plus';

  var table = new Tabular.Table({
    name: 'mfAdminTables.' + name,
    collection: collection,
    columns: options.columns || getCollectionColumns(collection),
    extraFields: options.extraFields,
    changeSelector: options.changeSelector
  });

  Admin.route(viewPath, {
    template: 'mfAdminCollectionsView',
    data: function () {
      return {
        title: name,
        subtitle: 'View',
        breadcrumb: [
          {
            label: name,
            path: viewPath,
            icon: icon
          }
        ],
        table: table
      };
    }
  });

  Admin.route(newPath, {
    template: 'mfAdminCollectionsNew',
    data: function () {
      return {
        title: name,
        subtitle: 'New',
        breadcrumb: [
          {
            label: name,
            path: viewPath,
            icon: icon
          },
          {
            label: 'New',
            path: newPath
          }
        ],
        collection: collection
      };
    }
  });

  if (Meteor.isClient) {
    var id = 'collection-' + name;

    Admin.sidebar.set(id, {
      label: name,
      icon: icon
    });

    Admin.sidebar.set(id + '.view', {
      label: 'View all',
      path: '/' + name,
      order: 10
    });

    Admin.sidebar.set(id + '.create', {
      label: 'New',
      path: '/' + name + '/new',
      order: 20
    });
  }

  if (Meteor.isServer) {
    Meteor.publish(countPubName, function () {
      Counts.publish(this, countPubName, collection.find());
    });
  }

  Admin.collections._collections[name] = {
    name: name,
    collection: collection,
    viewPath: Admin.path(viewPath),
    newPath: Admin.path(newPath),
    countPubName: countPubName
  };
  Admin.collections._dep.changed();
};

Admin.collections.get = function (name) {
  Admin.collections._dep.depend();

  if (name) {
    return Admin.collections._collections[name];
  }

  return _.values(Admin.collections._collections);
};
