# Configuring Map Settings via URL Parameters  

## Map Settings Overview

You can customize your map experience by adjusting settings directly in the URL. Here’s a quick guide to the available parameters:  

::: tip
Also, check out the [full documentation](/js-sdk-v2/query-parameters).
:::

### **center**  
Defines the map center using WGS84 coordinates (latitude, longitude).

Example: `?center=50.9422097115228,6.9760677305048855`  

*Default*
<img loading="lazy" src="/img/map-settings/default.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/center.webp" alt="" />

---

### **centerxy**  
Sets the map center using projected coordinates (x, y).

Example: `?centerxy=834.8957208062235,1174.5600925632295`  

*Default*
<img loading="lazy" src="/img/map-settings/default.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/center.webp" alt="" />

---

### **z**  
Specifies the floor/level name.

Example: `?z=2`

*Default*
<img loading="lazy" src="/img/map-settings/default.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/z.webp" alt="" />

---

### **bearing**  
Map rotation (0-360 degrees).

Example: `?bearing=180`  

*Default*
<img loading="lazy" src="/img/map-settings/default.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/bearing.webp" alt="" />

---

### **zoom**  
Zoom factor to apply (e.g., 1.5 for 50% zoom in, 0.5 for 50% zoom out).

Example: `?zoom=5`  

*Default*
<img loading="lazy" src="/img/map-settings/default.webp" alt="" />

*With parameter*
<img loading="lazy" src="/img/map-settings/zoom.webp" alt="" />

---

### **zoomtime**  
Sets the zoom animation duration in milliseconds (range: 500–5000).

Example: `?zoomtime=5000`  

*Default*
<video controls>
    <source src="/img/map-settings/default.mp4" type="video/mp4" />
</video>

*With parameter*
<video controls>
    <source src="/img/map-settings/zoomtime.mp4" type="video/mp4" />
</video>
