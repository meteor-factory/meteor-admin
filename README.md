Meteor Admin
============

`$ meteor add mfactory:admin`

This is the next version of `yogiben:admin`. It features a lot of improvements in the api and AdminLTE theme. Please bear in mind that this is one of the first releases and it may contain some bugs.

## Sidebar menu ##

Sidebar menu is designed to work well with your app as well as with other packages. For example `admin-analytics` package may add `Analytics` link to the sidebar:

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

### Arguments ###

`Admin.sidebar.set(key, options)`

- key - *string*

  The unique key of the item. Parent items are separated from children by dot.

  It's recomended for packages to use package name as a key, e.g. `foo:analytics.Users`. Or if many root items are needed: `foo:analytics/Analytics` `foo:analytics/Statistics`. This convention helps to avoid name clash.

- options - *object*

  Object containing item options like label, icon etc. See below for all possible values:

  - label - *string*

    Text of the link.

  - icon - *string*

    Name of the icon to be displayed next to the label. It should be font awesome icon without `fa-` prefix. You can check all available icons [here](http://fortawesome.github.io/Font-Awesome/icons/).

 - hidden - *boolean*

   If `true` the item (and his children if any) won't be displayed in the sidebar. By default it's `false`.

 - path - *string*

   Admin path to be used as the url of the item link. Admin path will be added to your path automatically. So if your path is `/analytics` and admin path is `/admin` the result will be '/admin/analytics'.

 - url - *string*

   You can use this property instead of `path` if you want to link to outside of admin dashboard. This won't be modified so you can use as a path to your app, e.g. `/home` or to other app, e.g. `https://facebook.com`.

 - order - *number*

   Allows you to control the order of items in the sidebar. All sidebar items are sorted descending by this number. Defaults to 0.

 - template - *string*

   Name of the template to be used instead of default one. For example you can use custom template to add a badge with a number of posts.
