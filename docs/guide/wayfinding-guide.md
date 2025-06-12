# Routes / Multipoint Wayfinding

::: info
Multipoint routing is available via the [JS SDK](java-script-api-reference.md).
:::

## Route Creation

The functionality that allows attendees to view routes connecting multiple points of interest (POIs).


::: info
A maximum of 8 intermediate waypoints is allowed (total: origin + 8 waypoints + destination = 10).
:::

[View Live Example](https://demo.expofp.com/?route%3A101-12%3A42-1%3Afalse%3A42-21%3A42-37%3A42-52%3A101-17)

```js
___fp.selectRoute(["42-1", "42-21", "42-37", "42-52", "101-17", "101-12"]);
```

<img src="/img/wayfinding/1.png" alt="Route Creation 1" />
<img src="/img/wayfinding/2.png" alt="Route Creation 2" />



## Optimization

An optional optimize mode attempts to compute the most efficient order in which to visit the selected POIs.

::: info
This feature is currently in Beta and may not always yield the absolutely optimal route.
:::

[View Live Example](https://demo.expofp.com/?route%3A41-3%3A42-1%3Afalse%3A42-3%3A42-21)

```js
const route = ___fp.getOptimizedRoutes(["42-1", "42-21", "42-3", "41-3"]).flatMap(r => r.waypoints);
___fp.selectRoute(route);
```

### Before Optimization

<img src="/img/wayfinding/before.png" alt="Before Optimization" />

### After Optimization

<img src="/img/wayfinding/after.png" alt="After Optimization" />
