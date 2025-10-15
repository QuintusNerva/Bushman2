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
        className={`bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl h-11 w-11 rounded-xl border-gray-200 hover:bg-white transition-all ${
          isAtMaxZoom ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleZoomIn}
        disabled={isAtMaxZoom}
        title="Zoom In"
      >
        <Plus className="h-5 w-5 text-gray-700" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl h-11 w-11 rounded-xl border-gray-200 hover:bg-white transition-all ${
          isAtMinZoom ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleZoomOut}
        disabled={isAtMinZoom}
        title="Zoom Out"
      >
        <Minus className="h-5 w-5 text-gray-700" />
      </Button>

      <div className="h-px bg-gray-200 my-1"></div>

      <Button
        variant="outline"
        size="icon"
        className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl h-11 w-11 rounded-xl border-gray-200 hover:bg-white transition-all"
        onClick={handleResetView}
        title="Reset View"
      >
        <Maximize2 className="h-5 w-5 text-gray-700" />
      </Button>

      <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-xl px-3 py-1.5 text-center mt-1 border border-gray-200">
        <span className="text-xs font-semibold text-gray-700">
          {currentZoom.toFixed(1)}x
        </span>
      </div>
    </div>
  );
}
