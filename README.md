Meteor Admin
============

`$ meteor add mfactory:admin`

This is the next version of `yogiben:admin`. It features a lot of improvements in the api and AdminLTE theme. Please bear in mind that this is one of the first releases so the api is not set in stone and it also may contain some bugs.

## Admin config ##

Admin package can be configured through `Admin.config` variable. It's `ReactiveDict`, so values can be set and get reactively, e.g:

```javascript
Admin.config.set('name', 'My Admin Page');
Admin.config.get('name'); // "My Admin Page"
```

Config can be accessed in Blaze templates through `Admin.config` helper, e.g:

```html
<h1>
  {{Admin.config.get 'name'}}
</h1>
```

### Available options ###

- **name** - *string*

  Name of admin dashboard. Will be displayed in the navbar. Defaults to `Admin`.

- **layoutTemplate** - *string*

  Name of the layout template. Defaults to `mfAdminLayout`.

## Admin permissions ##

All admin routes and publications check if logged user has admin permissions with `Admin.isAdmin` function. By any user with `admin` role (see [alanning:roles](https://github.com/alanning/meteor-roles) package) has admin permissions. You can overwrite this function e.g:

```javascript
Admin.isAdmin = function (userId) {
  return userId === SUPERUSERID;
};
```

## Sidebar and navbar menus ##

Sidebar and navbar menus are designed to work well with your app as well as with other packages. For example `admin-analytics` package may add `Analytics` link to the sidebar:

```javascript
Admin.sidebar.set('AdminAnalytics', {
  label: 'Analytics',
  icon: 'area-chart',
  path: '/analytics'
});
```

The first argument is unique key. This key can be used to alter the sidebar item. Suppose you want to change the icon. This can be done like this:

```javascript
Admin.sidebar.set('AdminAnalytics', {
  icon: 'pie-chart'
});
```

Sidebar items may have many children. For example if you want to add subitem to `AdminAnalytics` from previous snippet you have to create another item which key is parent key followed by dot and your item key, e.g:

```javascript
Admin.sidebar.set('AdminAnalytics.Users', {
  label: 'User stats',
  path: '/analytics/users'
});
```

Children items can be changed the same way, e.g:

```javascript
Admin.sidebar.set('AdminAnalytics.Users', {
  icon: 'user'
});
```

This will add an icon next to the label.

API for the navbar menu is same as for sidebar. For example:

```javascript
Admin.navbar.set('Profile', {
  path: '/profile'
});
```

### Arguments ###

`Admin.sidebar.set(key, options)`

or

`Admin.navbar.set(key, options)`

- **key** - *string*

  The unique key of the item. Parent items are separated from children by dot.

  It's recomended for packages to use package name as a key, e.g. `foo:analytics.Users`. Or if many root items are needed: `foo:analytics/Analytics` `foo:analytics/Statistics`. This convention helps to avoid name clash.

- **options** - *object*

  Object containing item options like label, icon etc. See below for all possible values:

  - **label** - *string*

    Text of the link.

  - **icon** - *string*

    Name of the icon to be displayed next to the label. It should be font awesome icon without `fa-` prefix. You can check all available icons [here](http://fortawesome.github.io/Font-Awesome/icons/).

 - **hidden** - *boolean*

   If `true` the item (and his children if any) won't be displayed in the sidebar. By default it's `false`.

 - **path** - *string*

   Admin path to be used as the url of the item link. Admin path will be added to your path automatically. So if your path is `/analytics` and admin path is `/admin` the result will be '/admin/analytics'.

 - **url** - *string*

   You can use this property instead of `path` if you want to link to outside of admin dashboard. This won't be modified so you can use as a path to your app, e.g. `/home` or to other app, e.g. `https://facebook.com`.

 - **order** - *number*

   Allows you to control the order of items in the sidebar. All sidebar items are sorted descending by this number. Defaults to 0.

 - **template** - *string*

   Name of the template to be used instead of default one. For example you can use custom template to add a badge with a number of posts.

## Collections ##

Admin allows you to easily add CRUD views for your collections to the dashboard. Collection must have defined schema with `aldeed:simple-schema` package.

### CRUD views ###

There are 3 views that will be generated:

- **View all documents**

  Displays table with all documents in the collection. Uses using `aldeed:tabular package`.

- **Edit document**

  Displays an update form. Uses `aldeed:autoform` package.

- **New document**

  Displays an insert form. Uses `aldeed:autoform` package.

- **Delete document**

  Displays confirmation modal when delete button is clicked.

### Adding a collection ###

`Admin.collections.add(name, options)`

Assume we have this collection of posts:

```javascript
Posts = new Mongo.Collection('posts');

Posts.attachSchema(
  new SimpleSchema({
    title: {
      type: String,
      max: 80
    },

    content: {
      type: String,
      autoform: {
        afFieldInput: {
          type: 'textarea',
          rows: 4
        }
      }
    },

    owner: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  })
);
```

Next we can add this collection to our dashboard like this:

```javascript
Admin.collections.add('Posts');
```

You should notice new sidebar item: **Posts** with **New** and **View all** subitems.

### Available options ###

- **collection** - *string*

  Name of collection object defined in global namespace. Can contain dots (e.g. `"MyCollections.Posts"`). Defaults to `name` argument of `Admin.collections.add`.

- **columns** - *array*

  Custom columns to be displayed in table view. See [aldeed:tabular](https://github.com/aldeed/meteor-tabular) docs to learn how to define them.

- **icon** - *string*

  Name of fontawesome icon (without `fa-` prefix) to be displayed in the sidebar.

- **extraFields** - *array*

  Will be passed to `Tabular.Table` constructor options. See [aldeed:tabular](https://github.com/aldeed/meteor-tabular) docs for more info.

- **changeSelector** - *function*

  Will be passed to `Tabular.Table` constructor options. See [aldeed:tabular](https://github.com/aldeed/meteor-tabular) docs for more info.
