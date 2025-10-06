# Guide: Configuring Map Settings via URL Parameters  

## Map Settings Overview

You can customize your map experience by adjusting settings directly in the URL. Here’s a quick guide to the available parameters:  

### **center**  
Defines the map center using WGS84 coordinates (latitude, longitude).  
Example: `?center=52.31801546937824,9.803534426718189`  

*Default*
<img loading="lazy" src="/img/map-settings/eurotier.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/center.webp" alt="" />

---

### **centerxy**  
Sets the map center using projected coordinates (x, y).  
Example: `?centerxy=6517.28955078125,3826.6064453125`  

*Default*
<img loading="lazy" src="/img/map-settings/eurotier.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/centerxy.webp" alt="" />

---

### **z**  
Specifies the floor/level name.  
Example: `?z=2`

*Default*
<img loading="lazy" src="/img/map-settings/demo.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/z.webp" alt="" />

---

### **bearing**  
Rotates the kiosk arrow icon (0–360 degrees). 
> *Currently works only in kiosk mode.*  

Example: `?bearing=180`  

*Default*
<img loading="lazy" src="/img/map-settings/kiosk.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/bearing.webp" alt="" />

---

### **zoom**  
Adjusts the zoom level (1–100).  
Example: `?zoom=5`  

*Default*
<img loading="lazy" src="/img/map-settings/eurotier.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/zoom.webp" alt="" />

---

### **zoomtime**  
Sets the zoom animation duration in milliseconds (range: 500–5000).  
Example: `?zoomtime=5000`  

*?zoomtime=500*
<video controls>
    <source src="/img/map-settings/zoomtime_500.mp4" type="video/mp4" />
</video>

*?zoomtime=5000*
<video controls>
    <source src="/img/map-settings/zoomtime_5000.mp4" type="video/mp4" />
</video>


## How to Reset Settings?

:::info
**Important Note**: Settings are applied only to the specific map they are sent to and only on the device where they are applied.
:::

Settings do not accumulate — each time new settings are sent, they overwrite the previous ones.

**Example**:

If you open a card with `?bearing=45` and later open it again with `?zoom=5`, the `bearing=45` setting will not be applied — only `zoom=5` will take effect.
In other words, if you need both settings, you must include them in the same request: `?bearing=45&zoom=5`.

**To cancel a previously applied setting** (e.g., `zoom=5`), you can set a new value (e.g., `zoom=1`).

---

Also, check out the [full documentation](/guide/query-parameters).