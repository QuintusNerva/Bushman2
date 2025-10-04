import { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Maximize2 } from 'lucide-react';

export function ZoomController() {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());
  const [isZooming, setIsZooming] = useState(false);

  useMapEvents({
    zoomstart: () => {
      setIsZooming(true);
    },
    zoomend: () => {
      setCurrentZoom(map.getZoom());
      setIsZooming(false);
    },
    zoom: () => {
      setCurrentZoom(map.getZoom());
    },
  });

  useEffect(() => {
    const minZoom = map.getMinZoom();
    const maxZoom = map.getMaxZoom();

    map.options.zoomSnap = 0.25;
    map.options.zoomDelta = 0.5;
    map.options.wheelPxPerZoomLevel = 120;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    };

    const mapContainer = map.getContainer();
    mapContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    mapContainer.addEventListener('touchmove', handleTouchMove, { passive: false });

    map.on('wheel', (e: any) => {
      const delta = e.originalEvent.deltaY;
      const currentZoom = map.getZoom();

      if (delta > 0) {
        if (currentZoom > minZoom) {
          map.setZoom(Math.max(currentZoom - 0.5, minZoom), { animate: true });
        }
      } else {
        if (currentZoom < maxZoom) {
          map.setZoom(Math.min(currentZoom + 0.5, maxZoom), { animate: true });
        }
      }
    });

    return () => {
      mapContainer.removeEventListener('touchstart', handleTouchStart);
      mapContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [map]);

  const handleZoomIn = () => {
    const maxZoom = map.getMaxZoom();
    const currentZoom = map.getZoom();
    if (currentZoom < maxZoom) {
      map.setZoom(Math.min(currentZoom + 1, maxZoom), { animate: true, duration: 0.25 });
    }
  };

  const handleZoomOut = () => {
    const minZoom = map.getMinZoom();
    const currentZoom = map.getZoom();
    if (currentZoom > minZoom) {
      map.setZoom(Math.max(currentZoom - 1, minZoom), { animate: true, duration: 0.25 });
    }
  };

  const handleResetView = () => {
    map.setView(map.getCenter(), 12, { animate: true, duration: 0.5 });
  };

  const minZoom = map.getMinZoom();
  const maxZoom = map.getMaxZoom();
  const isAtMinZoom = currentZoom <= minZoom;
  const isAtMaxZoom = currentZoom >= maxZoom;

  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className={`bg-white shadow-md h-11 w-11 rounded-lg transition-all ${
          isAtMaxZoom ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
        } ${isZooming ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
        onClick={handleZoomIn}
        disabled={isAtMaxZoom}
        title="Zoom In"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`bg-white shadow-md h-11 w-11 rounded-lg transition-all ${
          isAtMinZoom ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
        } ${isZooming ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
        onClick={handleZoomOut}
        disabled={isAtMinZoom}
        title="Zoom Out"
      >
        <Minus className="h-5 w-5" />
      </Button>

      <div className="h-px bg-slate-200 my-1"></div>

      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-md h-11 w-11 rounded-lg hover:bg-blue-50 transition-all"
        onClick={handleResetView}
        title="Reset View"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>

      <div className="bg-white shadow-md rounded-lg px-2 py-1 text-center mt-1">
        <span className="text-xs font-medium text-slate-600">
          {currentZoom.toFixed(1)}x
        </span>
      </div>
    </div>
  );
}
