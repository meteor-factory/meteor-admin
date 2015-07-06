Tree = function () {
  this._tree = {};
  this._dep = new Tracker.Dependency();
};

Tree.prototype.set = function (path, options) {
  this._dep.changed();

  _.reduce(path.split('.'), function (tree, key, index, path) {
    var isLeaf = index === (path.length - 1);

    if (! tree[key]) {
      tree[key] = {
        label: key,
        _tree: {}
      };
    }

    if (isLeaf) {
      _.extend(tree[key], options);
    }

    return tree[key]._tree;
  }, this._tree);
};

Tree.prototype.get = function (path) {
  this._dep.depend();

  if (! path) {
    return this._tree;
  }

  return _.reduce(path.split('.'), function (tree, key, index, path) {
    var isLeaf = index === (path.length - 1);
    return isLeaf ? tree[key] : tree[key]._tree;
  }, this._tree);
};
