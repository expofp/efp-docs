# Query Parameters

## Search text

| Description                       | Example      |
| --------------------------------- | ------------ |
| This displays the found entities. | ?b           |
| This displays the entity details. | ?biogreen-ag |

## `bookmarks`

| View bookmarks list. |
| ---------------------|
| ?bookmarks           |
| ?b=                  |
| ?ba=                 |


| Add exhibitors to bookmarks.  |
| ----------------------------- |
| ?b=10689074                   |
| ?b=10689074|10689072          |


| Add exhibitors to bookmarks and open details |
| ---------------------------------------------|
| ?ba=10689074                                 |


## `disableBookmarked`

| Description                               | Example                 |
| ----------------------------------------- | ----------------------- |
| Disables the ability to add to bookmarks. | ?disableBookmarked=true |

## `language`

| Description                       | Example   |
| --------------------------------- | --------- |
| This opens the language selector. | ?language |

## `kkiosk` 
> **@deprecated** use [kiosk](#kiosk) instead

| Description       | Example |
| ----------------- | ------- |
| Opens kiosk mode. | ?kkiosk |

## `nokkiosk`
> **@deprecated** use [kiosk](#kiosk) instead

| Description       | Example   |
| ----------------- | --------- |
| Exits kiosk mode. | ?nokkiosk |

## `route`

Colon-separated list of route points.

- `route:<Entity name>:<Entity name>`

| Description              | Example               |
| ------------------------ | --------------------- |
| This displays the route. | ?route:42-23:101-12   |

## `hide`

Provide a comma-separated list of UI elements to hide

- `controls` - Map controls
- `levels` - Levels (floors) control
- `overlay` - Search, list, etc.
- `header` - Header with logos and freeOrDemo

| Description                                     | Example                              |
| ----------------------------------------------- | ------------------------------------ |
| This hides the specified UI elements.           | ?hide=controls,levels,overlay,header |
| This shows all UI elements.                     | ?hide=                               |
| This hides an element and shows other elements. | ?hide=controls                       |

## `heatmap`

| Description                               | Example                                       |
| ----------------------------------------- | --------------------------------------------- |
| This shows the heatmap mode.              | ?heatmap=true&t=TOKEN                         |
| Heatmap view for "You are here" QR codes. | ?heatmap=true&type=yah&t=TOKEN                |
| Heatmap mode for kiosks.                  | ?heatmap=true&type=yah&subtype=kiosk&t=TOKEN  |

## `blue-dot`

- `blue-dot=<X>,<Y>,<Z>`

| Description                         | Example                                      |
| ----------------------------------- | -------------------------------------------- |
| This sets the blue dot coordinates. | ?blue-dot=8022.44384765625,8423.1962890625,1 |

## `noOverlay`

| Description              | Example          |
| ------------------------ | ---------------- |
| Hides the overlay panel. | ?noOverlay=true  |
| Shows the overlay panel. | ?noOverlay=false |

## `allowConsent`

| Description                     | Example             |
| ------------------------------- | ------------------- |
| This sets the consent settings. | ?allowConsent=true  |
| This sets the consent settings. | ?allowConsent=false |

## `hideHeaderLogo`

| Description                                | Example              |
| ------------------------------------------ | -------------------- |
| Hides the header logo and the ExpoFP logo. | ?hideHeaderLogo=true |

## `hideLogoInBooth`

| Description        | Example               |
| ------------------ | --------------------- |
| Hides booth logos. | ?hideLogoInBooth=true |

## `disableFeatured`

| Description                      | Example               |
| -------------------------------- | --------------------- |
| This disables the featured view. | ?disableFeatured=true |

## `disableGps`

| Description        | Example          |
| ------------------ | ---------------- |
| This disables GPS. | ?disableGps=true |

## `monochrome`

| Description               | Example          |
| ------------------------- | ---------------- |
| Sets the monochrome view. | ?monochrome=true |

## kiosk

| Description           | Example  |
| --------------------- | -------- |
| Enables kiosk mode.   | ?kiosk=1 |
| Disables kiosk mode. | ?kiosk=0 |

## sw

| Description                                  | Example |
| -------------------------------------------- | ------- |
| Enables the service worker for offline mode. | ?sw=1   |
| Disables the service worker.                 | ?sw=0   |

## zoomtime

| Description                             | Example        |
| --------------------------------------- | -------------- |
| Zoom animation duration (ms) (500-5000) | ?zoomtime=3000 |

## center

| Description                   | Example                                     |
| ----------------------------- | ------------------------------------------- |
| Map center in WGS84 "lat,lng" | ?center=52.32231711120545,9.814407599999997 |

## centerxy

| Description                   | Example                                    |
| ----------------------------- | -----------------------------------------  |
| Map center in projected "x,y" | ?centerxy=13595.177734375,6878.86865234375 |

## z

| Description      | Example  |
| ---------------- | -------- |
| Floor/level name | ?z=2     |

## bearing

::: info
Currently works only in kiosk mode.
:::

| Description                  | Example       |
| ---------------------------- | ------------- |
| Map rotation (0-360 degrees) | ?bearing=180  | 

## zoom

| Description        | Example |
| ------------------ | ------- |
| Zoom level (1-100) | ?zoom=5 |

## yah

| Description                        | Example    |
| ---------------------------------- | ---------- |
| It shows the "You Are Here" marker | ?yah=yah_1 |

## agenda

| Description                  | Example   |
| ---------------------------- | --------- |
| It displays the agenda view. | ?agenda   |

## exhibitors

| Displays the list of exhibitors                               |
| ------------------------------------------------------------- |
| ?exhibitors=RXhoaWJpdG9yXzE4OTc5NDQ=,RXhoaWJpdG9yXzE4OTc5MjM= |
| ?exhibitors=BioCycle Africa,UrbanQuest Design                 |

## debug

| Description                  | Example   |
| ---------------------------- | --------- |
| Enables debug mode           | ?debug=1  |
| Disables debug mode          | ?debug=0  |
