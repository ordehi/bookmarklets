# Bookmarklets

This is a collection of bookmarklets that are useful for every day surfing and particularly for work related tasks.

## Using a bookmarklet

When using any bookmarklet, you should copy the JavaScript code from the bookmarklet file, and add the prefix `javascript:` to it, then create a bookmark in your browser using the resulting code.

For example, if this is the code for a bookmarklet:

```js
console.log('not so useful');
```

You would add it to your bookmarks like this:

```js
javascript: console.log('not so useful');
```

Without that prefix, the bookmarklet will not work as the browser will try to follow it as if it were a normal URL.
