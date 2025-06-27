# Guide: Configuring Map Settings via URL Parameters  

You can customize your map experience by adjusting settings directly in the URL. Here’s a quick guide to the available parameters:  

### **zoomtime**  
Sets the zoom animation duration in milliseconds (range: 500–5000).  
Example: `?zoomtime=3000`  

<div style="width: 100%; min-height: 400px; position: relative; overflow: hidden; border-radius: 10px;"><iframe frameBorder="0" loading="lazy" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width:100%; height:100%" src="https://demo.expofp.com/?kiosk=0&zoomtime=3000" allow="clipboard-read; clipboard-write"></iframe></div>

### **center**  
Defines the map center using WGS84 coordinates (latitude, longitude).  
Example: `?center=52.322317,9.814407`  

<div style="width: 100%; min-height: 400px; position: relative; overflow: hidden; border-radius: 10px;"><iframe frameBorder="0" loading="lazy" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width:100%; height:100%" src="https://demo.expofp.com/?kiosk=0&center=52.322317,9.814407" allow="clipboard-read; clipboard-write"></iframe></div>

### **centerxy**  
Sets the map center using projected coordinates (x, y).  
Example: `?centerxy=13595.17,6878.86`  

<div style="width: 100%; min-height: 400px; position: relative; overflow: hidden; border-radius: 10px;"><iframe frameBorder="0" loading="lazy" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width:100%; height:100%" src="https://demo.expofp.com/?kiosk=0&centerxy=13595.17,6878.86" allow="clipboard-read; clipboard-write"></iframe></div>

### **z**  
Specifies the floor/level name.  
Example: `?z=2`

<div style="width: 100%; min-height: 400px; position: relative; overflow: hidden; border-radius: 10px;"><iframe frameBorder="0" loading="lazy" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width:100%; height:100%" src="https://demo.expofp.com/?kiosk=0&z=2" allow="clipboard-read; clipboard-write"></iframe></div>

### **bearing**  
Rotates the map (0–360 degrees). *Currently works only in kiosk mode.*  
Example: `?bearing=180`  

<div style="width: 100%; min-height: 400px; position: relative; overflow: hidden; border-radius: 10px;"><iframe frameBorder="0" loading="lazy" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width:100%; height:100%" src="https://demo.expofp.com/?k=1&bearing=180" allow="clipboard-read; clipboard-write"></iframe></div>

### **zoom**  
Adjusts the zoom level (1–100).  
Example: `?zoom=5`  

<div style="width: 100%; min-height: 400px; position: relative; overflow: hidden; border-radius: 10px;"><iframe frameBorder="0" loading="lazy" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width:100%; height:100%" src="https://demo.expofp.com/?kiosk=0&zoom=5" allow="clipboard-read; clipboard-write"></iframe></div>

For more details, check the [full documentation](/guide/query-parameters).