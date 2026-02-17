# UX specification: Blue dot and geolocation behavior

## 1. Initial map load & permissions

**Expected behavior:**

- **Permission request:** Upon opening the map, the system requests geolocation access via the browser.
- **Initial viewport:** Once permission is granted, the map automatically pans to the user’s current position (center-aligned).
- **Zoom level:** The system preserves the current zoom level. It does not automatically adjust the zoom to a predefined scale.  
  - *Note:* If the user is far from the event location, the map will pan to their coordinates, but they may need to zoom in manually to see details.
- **Floor awareness:** The Blue Dot is visible only when the user is on the currently active floor. If the user is on a different floor, the icon appears dimmed (semi-transparent) to reduce confusion.

## 2. Navigation & movement logic

**Is there a navigation mode?**

Currently, ExpoFP uses a manual focus approach rather than a turn-by-turn navigation lock.

- **Auto-centering:** The camera follows the user only on the first position update. After that, the map remains user-controlled. To re-center, the user must tap the **Find location** button.
- **Map rotation:** The map does not rotate automatically to match the user’s heading. It remains North-up (or at the default floor plan orientation).
- **Blue Dot orientation:** The Blue Dot rotates based on the device’s compass to indicate the user’s facing direction.

## 3. Wayfinding & route snapping

When a route is active, the system applies smart snapping to improve stability and usability:

- **Snapping threshold:** If the user is within 7.5 meters of the suggested route, the Blue Dot snaps to the route line. This reduces visible position shifts caused by GPS jitter.
- **Route progress:** As the user moves, the completed portion of the path changes color to grey, indicating progress.
- **Automatic rerouting:** If the user deviates from the route by more than 10 SVG units (approximately 5–7 meters) and is near a booth, the system automatically recalculates the route.

## 4. Visual States

| Icon        | State       | Meaning                                                                 |
|------------|------------|-------------------------------------------------------------------------|
| Blue circle | Active      | GPS is on, but compass heading is unavailable.                         |
| Blue arrow  | Directional | GPS is on and the compass is active (shows the user’s facing direction). |
| Dimmed dot  | Off-floor   | The user is on a different floor or layer than the one currently displayed. |
| Hidden      | No signal   | GPS signal is lost or location permission is denied.                   |
