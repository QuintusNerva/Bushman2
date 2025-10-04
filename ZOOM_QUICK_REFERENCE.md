# Map Zoom - Quick Reference Guide

## User Instructions

### Desktop Users
**Mouse Wheel Zoom:**
- Scroll **UP** = Zoom In
- Scroll **DOWN** = Zoom Out

**Manual Controls:**
- Click **+** button = Zoom In
- Click **-** button = Zoom Out
- Click **⛶** button = Reset to Default View
- View current zoom level in display (e.g., "12.5x")

**Other Methods:**
- **Double-click** anywhere on map = Zoom In

---

### Mobile/Tablet Users
**Pinch Gestures:**
- **Pinch** (bring two fingers together) = Zoom Out
- **Spread** (move two fingers apart) = Zoom In

**Manual Controls:**
- Tap **+** button = Zoom In
- Tap **-** button = Zoom Out
- Tap **⛶** button = Reset to Default View
- View current zoom level in display (e.g., "12.5x")

**Other Methods:**
- **Double-tap** anywhere on map = Zoom In

---

## Developer Quick Start

### Files Modified
1. `src/components/map/InteractiveMap.tsx` - Added zoom configuration
2. `src/components/map/ZoomController.tsx` - New zoom control component

### Key Features
✅ Pinch-to-zoom (mobile/tablet)
✅ Scroll-to-zoom (desktop)
✅ Custom zoom controls (+/- buttons)
✅ Zoom level display (real-time)
✅ Reset view button
✅ Visual feedback during zoom
✅ Smooth animations
✅ Zoom boundaries (3x to 18x)
✅ Double-click/tap zoom

### Configuration
```typescript
// In InteractiveMap.tsx MapContainer props
zoom={12}              // Initial zoom level
minZoom={3}            // Minimum zoom
maxZoom={18}           // Maximum zoom
scrollWheelZoom={true} // Enable wheel zoom
touchZoom={true}       // Enable pinch zoom
doubleClickZoom={true} // Enable double-click
zoomControl={false}    // Use custom controls
```

### Customization Options

**Adjust Zoom Sensitivity:**
```typescript
// In ZoomController.tsx useEffect
map.options.zoomSnap = 0.25;    // 0.1 to 1.0
map.options.zoomDelta = 0.5;    // Increment per action
map.options.wheelPxPerZoomLevel = 120; // Wheel sensitivity
```

**Change Animation Speed:**
```typescript
// Zoom button animation
map.setZoom(newZoom, { animate: true, duration: 0.25 });
//                                     ^^^^^^^^ in seconds

// Reset view animation
map.setView(center, zoom, { animate: true, duration: 0.5 });
//                                          ^^^^^^^^ in seconds
```

**Adjust Zoom Range:**
```typescript
// In InteractiveMap.tsx
minZoom={1}    // World view
maxZoom={20}   // Street level detail
```

---

## Component Architecture

```
InteractiveMap (Parent)
└── MapContainer (Leaflet)
    ├── MapControls (Sidebar toggle + ZoomController)
    │   └── ZoomController (New Component)
    │       ├── Zoom In Button
    │       ├── Zoom Out Button
    │       ├── Reset View Button
    │       └── Zoom Level Display
    ├── TileLayer (Map tiles)
    ├── Markers (Jobs, Suppliers, Contractor)
    └── Other components...
```

---

## API Methods

### Access Map Instance
```typescript
const map = useMap(); // In any child component of MapContainer
```

### Programmatic Zoom
```typescript
// Zoom to specific level
map.setZoom(15);

// Zoom with animation
map.setZoom(15, { animate: true, duration: 0.5 });

// Zoom to location
map.setView([lat, lng], 15, { animate: true });

// Get current zoom
const currentZoom = map.getZoom();

// Get zoom limits
const minZoom = map.getMinZoom();
const maxZoom = map.getMaxZoom();
```

---

## Troubleshooting

**Problem:** Pinch zoom not working
**Solution:** Ensure `touchZoom={true}` in MapContainer props

**Problem:** Mouse wheel not zooming
**Solution:** Ensure `scrollWheelZoom={true}` in MapContainer props

**Problem:** Buttons not visible
**Solution:** Check z-index: `z-[1000]` should be sufficient

**Problem:** Jerky animations
**Solution:** Adjust `zoomSnap` and `zoomDelta` values

**Problem:** Zoom too sensitive
**Solution:** Increase `wheelPxPerZoomLevel` value

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Pinch Zoom | ✅ | ✅ | ✅ | ✅ | ✅ |
| Wheel Zoom | ✅ | ✅ | ✅ | ✅ | N/A |
| Controls | ✅ | ✅ | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Performance Tips

1. **Optimize Tile Loading:** Use appropriate zoom levels for your use case
2. **Limit Max Zoom:** Don't allow zoom levels beyond available tile detail
3. **Debounce Updates:** Already handled by Leaflet internally
4. **GPU Acceleration:** Use CSS transforms (already implemented)

---

## Accessibility

- **Keyboard:** Use +/- keys (Leaflet default)
- **Screen Readers:** Buttons have title attributes
- **Touch Targets:** All buttons are 44px × 44px minimum
- **Visual Feedback:** Clear indicators for zoom state

---

## Testing Commands

```bash
# Build project
npm run build

# Run development server
npm run dev

# Type checking only
tsc --noEmit
```

---

## Additional Resources

- Full documentation: `ZOOM_IMPLEMENTATION.md`
- Leaflet docs: https://leafletjs.com/reference.html
- React Leaflet: https://react-leaflet.js.org/

---

**Quick Reference Version**: 1.0
**Last Updated**: 2025-10-04
