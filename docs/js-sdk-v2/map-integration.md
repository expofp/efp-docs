# Map integration

Embed the interactive floor plan on your website using the ExpoFP script.

::: tip
Make sure the container has a set width and height.
:::

## Method 1: Initialize with JavaScript

- Add a container element to hold the floor plan.
- Include the ExpoFP script from your event’s domain.
- Initialize the floor plan by creating a new `ExpoFP.FloorPlan` instance and passing:
    - `element`: The container element.
    - `eventId`: Your event ID.
    - `dataUrl`: The data URL for your event.

This method gives you direct control over initialization in your application’s JavaScript.

::: info
Other options are also available, more details <a href="/guide/java-script-api-reference" target="_blank">here</a>.
:::

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width"
        />
        <title>Floor Plan</title>
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <div id="floorplan" style="width: 100%; height: 100dvh;">Loading...</div>
        <script
            src="https://dlgagritechnica2025.expofp.com/packages/main/expofp.js"
            crossorigin="anonymous"
        ></script>
        <script>
            // It is necessary to pass eventId and dataUrl
            new ExpoFP.FloorPlan({
                element: document.querySelector("#floorplan"),
                eventId: "dlgagritechnica2025",
                dataUrl: "https://dlgagritechnica2025.expofp.com/data/",
            });
        </script>
    </body>
</html>
```

<p><a href="/examples/map-integration/1.html" target="_blank">Example 1</a></p>

## Method 2: Auto-initialize with data attributes

- Add a container element and set the attributes:
    - `expofp-floorplan` class.
    - `data-event-id` to your event ID.
    - `data-data-url` to your event’s data URL.
- Include the ExpoFP script from your event’s domain.

The library will automatically detect the container and initialize the floor plan based on the data attributes.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width"
        />
        <title>Floor Plan</title>
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <!-- It is necessary to pass the expofp-floorplan class, the data-event-id, and the data-data-url -->
        <div
            style="width: 100%; height: 100dvh;"
            class="expofp-floorplan"
            data-event-id="dlgagritechnica2025"
            data-data-url="https://dlgagritechnica2025.expofp.com/data/"
        >
            Loading...
        </div>
        <script
            src="https://dlgagritechnica2025.expofp.com/packages/main/expofp.js"
            crossorigin="anonymous"
        ></script>
    </body>
</html>
```

<p><a href="/examples/map-integration/2.html" target="_blank">Example 2</a></p>

## Method 3: Using an iframe

To embed the floor plan, insert an iframe with your event URL.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width"
        />
        <title>Floor Plan</title>
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <div style="width:100%; height: 100dvh; position: relative;">
            <iframe
                style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width: 100%;height: 100%;border: 0;"
                src="https://dlgagritechnica2025.expofp.com?allowConsent=false"
                allow="clipboard-read; clipboard-write"
                frameborder="0"
            ></iframe>
        </div>
    </body>
</html>
```

<p><a href="/examples/map-integration/3.html" target="_blank">Example 3</a></p>
