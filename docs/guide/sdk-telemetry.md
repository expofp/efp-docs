---
description: "Turn on SDK telemetry on an ExpoFP floor plan to help ExpoFP support diagnose blue dot and routing issues: open the debug panel, enable efp-sdkTelemetry, reproduce the problem."
---

# Collect SDK telemetry for troubleshooting

When the blue dot or a route from the current position behaves unexpectedly at a venue, ExpoFP support may ask you to turn on **SDK telemetry** on the affected device. While it is on, the floor plan sends ExpoFP the position updates it receives, exactly as it received them. This shows us what the floor plan was given (coordinates, floor) and what it did with it — which is usually enough to tell a positioning problem from a floor plan problem.

::: info
Telemetry is **off by default** and is turned on **per device**: only the browser or app where you enabled it sends data. Other visitors are not affected.
:::

::: warning
SDK telemetry is available in floor plan versions that include the `efp-sdkTelemetry` setting. If you do not see this setting in Step 3, your floor plan runs an earlier version — contact ExpoFP support.
:::

## Before you start

- Use the **same device and the same app** (or browser) where the problem appears. Telemetry records what happens on that device only.
- The device needs an internet connection to send the data. Short connection drops are fine: position updates are kept on the device and sent when the connection is back.
- In a browser, a private (incognito) window helps to rule out cached data. Note that the setting is lost when the private window is closed.

## Step 1. Open the floor plan

Open the floor plan as a visitor would: in your mobile app, in the browser, or on the page where it is embedded.

## Step 2. Open the debug panel

Quickly tap **7 times in the top right corner** of the floor plan. On a computer, click 7 times.

- Tap within the corner area (about 80 px from both edges).
- Do not pause between taps for more than about half a second, otherwise the count starts again.

The debug panel opens on the **Settings** tab. The floor plan is hidden while the panel is open.

## Step 3. Turn on telemetry

1. In the settings list, find **`efp-sdkTelemetry`**.
2. Change its value from `default` to **`on`**.
3. Press **Reload with the applied changes**.

The floor plan reloads with telemetry turned on. The setting is stored in this browser or app and stays on after a reload or restart, until you turn it off.

## Step 4. Reproduce the problem

Telemetry sends data only when something happens, so do the actions that show the problem:

1. Wait until the blue dot appears.
2. Build the route that goes wrong (for example, from your current position to a booth).
3. **Move around** so that the position changes. If possible, repeat in a second place — for example, in another hall, and both indoors and outdoors.

## Step 5. Tell ExpoFP support

Send ExpoFP support a message with:

- the floor plan address (for example, `https://myevent.expofp.com`);
- the date and time of the test, with the time zone;
- the device, the operating system version, and the app name and version (or the browser);
- what you expected and what happened instead. A screenshot or a screen recording helps a lot.

We find your session by the event and the time, so the time is important.

## Step 6. Turn telemetry off

When the test is finished:

1. Open the debug panel: tap the small tab with an arrow on the right edge of the screen (or tap 7 times in the corner again).
2. Set **`efp-sdkTelemetry`** to `off` or `default` and press **Reload with the applied changes**.

To remove the tab from the right edge as well, press **Reset all and reload**. This resets all debug settings in this browser or app.

## What is sent

While telemetry is on, the floor plan sends this data to the ExpoFP telemetry service (`sdk-telemetry.expofp.com`, HTTPS):

| Event | When | Data |
| --- | --- | --- |
| `load` | The floor plan has loaded | Time, floor plan version, event key |
| `selectCurrentPosition` | The floor plan receives a position update | Time, floor plan version, event key, and for each update: the position as it was passed (`x`/`y` or `lat`/`lng`, and the floor `z`), the `focus` and `icon` arguments, the floor the position was placed on, the floor of the active route, and whether the position was placed on the plan |

Position updates are the [`selectCurrentPosition`](https://js-sdk.expofp.com/) calls that the ExpoFP mobile SDK (with a location provider such as GPS or an indoor positioning system) or your own code makes.

Good to know:

- **No personal data is added.** The floor plan does not attach a name, an e-mail, a user ID or a device ID. The data does contain the location of the device at the venue during the test.
- **Low traffic.** Position updates are sent in batches, not more than one request per second.
- **Offline-tolerant.** Updates that could not be sent stay on the device (the most recent 3,000) and are sent later.
- **Retention.** ExpoFP keeps telemetry data for 30 days and uses it only for troubleshooting.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| The debug panel does not open | Tap faster, and keep all 7 taps in the same corner. In a mobile app, tap in the corner of the floor plan view, not of the screen, if the floor plan does not fill the screen. |
| There is no `efp-sdkTelemetry` in the list | The floor plan runs a version without SDK telemetry. Contact ExpoFP support. |
| ExpoFP support sees the `load` event but no positions | The floor plan received no position updates. Make sure location is enabled, the blue dot is shown, and you moved during the test. |
| The setting is `default` again after a restart | The browser or app does not keep local data (for example, a private window). Turn the setting on again in the same session as the test. |
