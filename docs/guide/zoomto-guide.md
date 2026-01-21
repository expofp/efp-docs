# Zoom to Booth

Select and zoom to a booth when the user clicks on it.

::: tip
See the [JavaScript API Reference](/guide/java-script-api-reference) for all available methods.
:::

## Code

```js
new ExpoFP.FloorPlan({
                element: document.querySelector("#floorplan"),
                eventId: "demo",
                dataUrl: "https://demo.expofp.com/data/",
                noOverlay: true,
    
                onInit: (fp) => {
                    // Expose
                    window.___fp = fp;
                    // Hide all UI elements
                    fp.setVisibility({
                        "controls": false,
                        "levels": false,
                        "header": false,
                        "overlay": false
                    });
                    // Zoom to booth with name '1'
                    fp.zoomTo({ booths:[ { name: '1' } ]})
                },
            });
```

## Live Demo

<iframe
  src="https://stackblitz.com/edit/stackblitz-starters-237p1clm?embed=1&file=index.html&hideExplorer=1&hideNavigation=1&view=editor"
  style="width:100%; height:500px; border:0; border-radius:4px; overflow:hidden;"
  title="Zoom to Booth Example"
></iframe>

## Related

[Query parameters](/guide/query-parameters#zoom) - set initial zoom level via URL  
[JavaScript API Reference](/guide/java-script-api-reference) - full method documentation
