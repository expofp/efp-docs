# Bookmarks

The app allows users to save items as bookmarks.

::: info
Please note that adding bookmarks is disabled in [kiosk mode](/guide/query-parameters#kkiosk).
:::

## Bookmarking feature in the app interface

::: details Desktop
<p style="display: grid; grid-auto-flow: row; gap: 10px;">
    <img src="/img/bookmarks/1.png" alt="Desktop view 1" />
    <img src="/img/bookmarks/2.png" alt="Desktop view 2" />
</p>
:::

::: details Mobile
<p style="display: grid; grid-auto-flow: column; gap: 10px;">
    <img src="/img/bookmarks/3.png" alt="Mobile view 1" />
    <img src="/img/bookmarks/4.png" alt="Mobile view 2" />
</p>
:::

## Bookmark management in the JS SDK

::: tip
Refer to the [JavaScript API Reference](/guide/java-script-api-reference) for more information.
:::

### Adding and removing bookmarks

```js{7,10}
const fp = new ExpoFP.FloorPlan({
    element: document.querySelector("#floorplan"),
    eventId: "demo",
});

// Save to bookmarks
fp.setBookmarks([{ name: "Alaska Airlines", bookmarked: true }]);
fp.setBookmarks([{ externalId: "bizx", bookmarked: true }]);

// Remove from bookmarks
fp.setBookmarks([{ name: "Alaska Airlines", bookmarked: false }]);
fp.setBookmarks([{ externalId: "bizx", bookmarked: false }]);
```

### Handling bookmark additions

```js{4-6}
new ExpoFP.FloorPlan({
    element: document.querySelector("#floorplan"),
    eventId: "demo",
    onBookmarkClick: e => {
        // ...
    }
});
```

### Using the `onInit` function

```js{4-8}
new ExpoFP.FloorPlan({
    element: document.querySelector("#floorplan"),
    eventId: "demo",
    onInit: fp => {
        fp.setBookmarks([
            // ...
        ]);
    }
});
```

## Bookmarking via URL parameters

The following [parameters](/guide/query-parameters#bookmarks) are supported.
