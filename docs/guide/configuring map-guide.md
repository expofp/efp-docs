# Guide: Configuring Map Settings via URL Parameters  

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
Rotates the map (0–360 degrees). 
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

---

For more details, check the [full documentation](/guide/query-parameters).