# Query Parameters

## Search text

| Description                       | Example                         |
| --------------------------------- | ------------------------------- |
| This displays the found entities. | https://demo.expofp.com/?e      |
| This displays the entity details. | https://demo.expofp.com/?expofp |

## `bookmarks`

| Description                                                       | Example                             |
| ----------------------------------------------------------------- | ----------------------------------- |
| This opens the bookmarks list.                                    | https://demo.expofp.com/?bookmarks  |
| This opens the bookmarks list.                                    | https://demo.expofp.com/?b=         |
| Add an exhibitor to bookmarks and display its detail information. | https://demo.expofp.com/?ba=2782719 |

## `disableBookmarked`

| Description                               | Example                                         |
| ----------------------------------------- | ----------------------------------------------- |
| Disables the ability to add to bookmarks. | https://demo.expofp.com/?disableBookmarked=true |

## `language`

| Description                       | Example                           |
| --------------------------------- | --------------------------------- |
| This opens the language selector. | https://demo.expofp.com/?language |

## `kkiosk`

| Description       | Example                         |
| ----------------- | ------------------------------- |
| Opens kiosk mode. | https://demo.expofp.com/?kkiosk |

## `nokkiosk`

| Description       | Example                           |
| ----------------- | --------------------------------- |
| Exits kiosk mode. | https://demo.expofp.com/?nokkiosk |

## `route`

Colon-separated list of route points.

- `route:<Entity name>:<Entity name>`

| Description              | Example                                       |
| ------------------------ | --------------------------------------------- |
| This displays the route. | https://demo.expofp.com/?route:main-stage:458 |

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

| Description                         | Example                                                           |
| ----------------------------------- | ----------------------------------------------------------------- |
| This sets the blue dot coordinates. | https://demo.expofp.com/?blue-dot=42858.0429687,12087.591796875,2 |

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
