# Query Parameters

## Search text

`string`

| Description             | Example                    |
| ----------------------- | -------------------------- |
| Displays found entities | https://demo.expofp.com/?e |

## Entity name

`string`

| Description             | Example                         |
| ----------------------- | ------------------------------- |
| Displays entity details | https://demo.expofp.com/?expofp |

## `bookmarks`

| Description              | Example                            |
| ------------------------ | ---------------------------------- |
| Opens the bookmarks list | https://demo.expofp.com/?bookmarks |

## `language`

| Description                 | Example                           |
| --------------------------- | --------------------------------- |
| Opens the language selector | https://demo.expofp.com/?language |

## `kkiosk`

| Description          | Example                         |
| -------------------- | ------------------------------- |
| Opens the kiosk mode | https://demo.expofp.com/?kkiosk |

## `nokkiosk`

| Description          | Example                           |
| -------------------- | --------------------------------- |
| Exits the kiosk mode | https://demo.expofp.com/?nokkiosk |

## `route`

Colon-separated list of route points.

- `route:<Entity name>:<Entity name>`

| Description        | Example                                       |
| ------------------ | --------------------------------------------- |
| Displays the route | https://demo.expofp.com/?route:main-stage:458 |

## `hide`

Comma-separated list of UI elements to hide.

- `controls` - Map controls
- `levels` - Levels (floors) control
- `overlay` - Search, list, etc.
- `header` - Header with logos and freeOrDemo

| Description                               | Example                                                      |
| ----------------------------------------- | ------------------------------------------------------------ |
| Hides the specified UI elements           | https://demo.expofp.com/?hide=controls,levels,overlay,header |
| Shows all UI elements                     | https://demo.expofp.com/?hide=                               |
| Hides an element and shows other elements | https://demo.expofp.com/?hide=controls                       |
