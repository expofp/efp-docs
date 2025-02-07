# Query Parameters

## Search text

| Description                       | Example                              |
| --------------------------------- | ------------------------------------ |
| This displays the found entities. | https://demo.expofp.com/?b           |
| This displays the entity details. | https://demo.expofp.com/?biogreen-ag |

## `bookmarks`

| View bookmarks list.                    |
| ----------------------------------------|
| https://demo.expofp.com/?bookmarks      |
| https://demo.expofp.com/?b=             |
| https://demo.expofp.com/?ba=            |


| Add exhibitors to bookmarks.                   |
| ---------------------------------------------- |
| https://demo.expofp.com/?b=10689074            |
| https://demo.expofp.com/?b=10689074|10689072   |


| Add exhibitors to bookmarks and open details  |
| ----------------------------------------------|
| https://demo.expofp.com/?ba=10689074          |


## `disableBookmarked`

| Description                               | Example                                         |
| ----------------------------------------- | ----------------------------------------------- |
| Disables the ability to add to bookmarks. | https://demo.expofp.com/?disableBookmarked=true |

## `language`

| Description                       | Example                           |
| --------------------------------- | --------------------------------- |
| This opens the language selector. | https://demo.expofp.com/?language |

## `kkiosk` 
> **@deprecated** use [kiosk](#kiosk) instead

| Description       | Example                         |
| ----------------- | ------------------------------- |
| Opens kiosk mode. | https://demo.expofp.com/?kkiosk |

## `nokkiosk`
> **@deprecated** use [kiosk](#kiosk) instead

| Description       | Example                           |
| ----------------- | --------------------------------- |
| Exits kiosk mode. | https://demo.expofp.com/?nokkiosk |

## `route`

Colon-separated list of route points.

- `route:<Entity name>:<Entity name>`

| Description              | Example                                       |
| ------------------------ | --------------------------------------------- |
| This displays the route. | https://demo.expofp.com/?route:42-23:101-12   |

## `hide`

Provide a comma-separated list of UI elements to hide

- `controls` - Map controls
- `levels` - Levels (floors) control
- `overlay` - Search, list, etc.
- `header` - Header with logos and freeOrDemo

| Description                                     | Example                                                      |
| ----------------------------------------------- | ------------------------------------------------------------ |
| This hides the specified UI elements.           | https://demo.expofp.com/?hide=controls,levels,overlay,header |
| This shows all UI elements.                     | https://demo.expofp.com/?hide=                               |
| This hides an element and shows other elements. | https://demo.expofp.com/?hide=controls                       |

## `heatmap`

| Description                  | Example                               |
| ---------------------------- | ------------------------------------- |
| This shows the heatmap mode. | https://demo.expofp.com/?heatmap=true |

## `blue-dot`

- `blue-dot=<X>,<Y>,<Z>`

| Description                         | Example                                                              |
| ----------------------------------- | -------------------------------------------------------------------- |
| This sets the blue dot coordinates. | https://demo.expofp.com/?blue-dot=8022.44384765625,8423.1962890625,1 |

## `noOverlay`

| Description              | Example                                  |
| ------------------------ | ---------------------------------------- |
| Hides the overlay panel. | https://demo.expofp.com/?noOverlay=true  |
| Shows the overlay panel. | https://demo.expofp.com/?noOverlay=false |

## `allowConsent`

| Description                     | Example                                     |
| ------------------------------- | ------------------------------------------- |
| This sets the consent settings. | https://demo.expofp.com/?allowConsent=true  |
| This sets the consent settings. | https://demo.expofp.com/?allowConsent=false |

## `hideHeaderLogo`

| Description                                | Example                                      |
| ------------------------------------------ | -------------------------------------------- |
| Hides the header logo and the ExpoFP logo. | https://demo.expofp.com/?hideHeaderLogo=true |

## `hideLogoInBooth`

| Description        | Example                                       |
| ------------------ | --------------------------------------------- |
| Hides booth logos. | https://demo.expofp.com/?hideLogoInBooth=true |

## `disableFeatured`

| Description                      | Example                                       |
| -------------------------------- | --------------------------------------------- |
| This disables the featured view. | https://demo.expofp.com/?disableFeatured=true |

## `disableGps`

| Description        | Example                                  |
| ------------------ | ---------------------------------------- |
| This disables GPS. | https://demo.expofp.com/?disableGps=true |

## `monochrome`

| Description               | Example                                  |
| ------------------------- | ---------------------------------------- |
| Sets the monochrome view. | https://demo.expofp.com/?monochrome=true |

## `previewMode`

| Description                      | Example                                    |
| -------------------------------- | ------------------------------------------ |
| This shows the preview mode.     | https://demo.expofp.com/?previewMode=true  |
| This will hide the preview mode. | https://demo.expofp.com/?previewMode=false |

## kiosk

| Description           | Example                          |
| --------------------- | -------------------------------- |
| Enables kiosk mode.   | https://demo.expofp.com/?kiosk=1 |
| Disables kiosk modee. | https://demo.expofp.com/?kiosk=0 |

## sw

| Description                                  | Example                       |
| -------------------------------------------- | ----------------------------- |
| Enables the service worker for offline mode. | https://demo.expofp.com/?sw=1 |
| Disables the service worker.                 | https://demo.expofp.com/?sw=0 |
