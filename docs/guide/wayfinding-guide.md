# Wayfinding

::: info
Currently, we can use multi-point routing through the [JS SDK](java-script-api-reference.md).
:::

## Route Creation

::: info
Maximum of 8 waypoints allowed (total: from + 8 waypoints + to = 10).
:::

[See Live Example](https://demo.expofp.com/?route%3A101-12%3A42-1%3Afalse%3A42-21%3A42-37%3A42-52%3A101-17)

```js
___fp.selectRoute(["42-1", "42-21", "42-37", "42-52", "101-17", "101-12"]);
```

<img src="/img/wayfinding/1.png" alt="Route Creation 1" />
<img src="/img/wayfinding/2.png" alt="Route Creation 2" />



## Optimization

::: info
Experimental feature.
:::

[See Live Example](https://demo.expofp.com/?route%3A41-3%3A42-1%3Afalse%3A42-3%3A42-21)

```js
const route = ___fp.getOptimizedRoutes(["42-1", "42-21", "42-3", "41-3"]).flatMap(r => r.waypoints);
___fp.selectRoute(route);
```

### Before Optimization

<img src="/img/wayfinding/before.png" alt="Before Optimization" />

### After Optimization

<img src="/img/wayfinding/after.png" alt="After Optimization" />
