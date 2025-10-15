import L from 'leaflet';

export const PIN_COLORS = {
  available: '#4ade80',
  scheduled: '#5b9bd5',
  supplyHouse: '#e879f9',
  selected: '#60a5fa',
  contractor: '#a78bfa'
} as const;

const createCleanMarker = (
  color: string,
  isSelected = false,
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const sizeMap = {
    small: 10,
    medium: 14,
    large: 18
  };
  
  const dotSize = sizeMap[size];
  const scale = isSelected ? 1.3 : 1;
  const finalSize = dotSize * scale;

  return L.divIcon({
    className: 'custom-clean-marker',
    html: `
      <style>
        .marker-dot-${color.replace('#', '')} {
          width: ${finalSize}px;
          height: ${finalSize}px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .marker-dot-${color.replace('#', '')}:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
        }
      </style>
      <div class="marker-dot-${color.replace('#', '')}"></div>
    `,
    iconSize: [finalSize + 6, finalSize + 6],
    iconAnchor: [(finalSize + 6) / 2, (finalSize + 6) / 2],
    popupAnchor: [0, -(finalSize + 6) / 2],
  });
};

export const createJobMarker = (status: string, isSelected = false) => {
  const isAvailable = status === 'unclaimed';
  
  if (isAvailable) {
    // Available job - green pin with dollar sign
    return L.divIcon({
      className: 'custom-available-job-marker',
      html: `
        <style>
          .available-job-marker {
            width: 60px;
            height: 80px;
          }
          .available-job-marker svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          }
        </style>
        <div class="available-job-marker">
          <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#22c55e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
              </linearGradient>
            </defs>
            
            <g transform="translate(30, 30)">
              <!-- Drop shadow -->
              <ellipse cx="0" cy="45" rx="18" ry="6" fill="rgba(0,0,0,0.3)" opacity="0.5"/>
              
              <!-- Pin body -->
              <path d="M 0,-40 C -15,-40 -25,-30 -25,-15 C -25,0 0,40 0,40 C 0,40 25,0 25,-15 C 25,-30 15,-40 0,-40 Z" 
                    fill="url(#greenGradient)" stroke="#15803d" stroke-width="2"/>
              
              <!-- Dollar sign -->
              <text x="0" y="-7" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">$</text>
            </g>
          </svg>
        </div>
      `,
      iconSize: [60, 80],
      iconAnchor: [30, 70],
      popupAnchor: [0, -70],
    });
  } else {
    // Scheduled job - blue pin with checkmark
    return L.divIcon({
      className: 'custom-scheduled-job-marker',
      html: `
        <style>
          .scheduled-job-marker {
            width: 60px;
            height: 80px;
          }
          .scheduled-job-marker svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          }
        </style>
        <div class="scheduled-job-marker">
          <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#4f46e5;stop-opacity:1" />
              </linearGradient>
            </defs>
            
            <g transform="translate(30, 30)">
              <!-- Drop shadow -->
              <ellipse cx="0" cy="45" rx="18" ry="6" fill="rgba(0,0,0,0.3)" opacity="0.5"/>
              
              <!-- Pin body -->
              <path d="M 0,-40 C -15,-40 -25,-30 -25,-15 C -25,0 0,40 0,40 C 0,40 25,0 25,-15 C 25,-30 15,-40 0,-40 Z" 
                    fill="url(#blueGradient)" stroke="#1e40af" stroke-width="2"/>
              
              <!-- Checkmark icon -->
              <path d="M -8,-12 L -3,-7 L 8,-18" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </div>
      `,
      iconSize: [60, 80],
      iconAnchor: [30, 70],
      popupAnchor: [0, -70],
    });
  }
};

export const createSupplierMarker = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-supplier-marker',
    html: `
      <style>
        .supplier-location-marker {
          width: 60px;
          height: 80px;
        }
        .supplier-location-marker svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }
      </style>
      <div class="supplier-location-marker">
        <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#fb923c;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <g transform="translate(30, 30)">
            <!-- Drop shadow -->
            <ellipse cx="0" cy="45" rx="18" ry="6" fill="rgba(0,0,0,0.3)" opacity="0.5"/>
            
            <!-- Pin body -->
            <path d="M 0,-40 C -15,-40 -25,-30 -25,-15 C -25,0 0,40 0,40 C 0,40 25,0 25,-15 C 25,-30 15,-40 0,-40 Z" 
                  fill="url(#orangeGradient)" stroke="#c2410c" stroke-width="2"/>
            
            <!-- Building icon -->
            <rect x="-9" y="-20" width="18" height="16" fill="white" stroke="white" stroke-width="1"/>
            <rect x="-7" y="-18" width="4" height="4" fill="#ea580c"/>
            <rect x="3" y="-18" width="4" height="4" fill="#ea580c"/>
            <rect x="-7" y="-12" width="4" height="4" fill="#ea580c"/>
            <rect x="3" y="-12" width="4" height="4" fill="#ea580c"/>
            <rect x="-7" y="-6" width="4" height="4" fill="#ea580c"/>
            <rect x="3" y="-6" width="4" height="4" fill="#ea580c"/>
          </g>
        </svg>
      </div>
    `,
    iconSize: [60, 80],
    iconAnchor: [30, 70],
    popupAnchor: [0, -70],
  });
};

export const createContractorMarker = () => {
  return L.divIcon({
    className: 'custom-contractor-marker',
    html: `
      <style>
        .contractor-location-marker {
          width: 80px;
          height: 80px;
        }
        .contractor-location-marker svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }
      </style>
      <div class="contractor-location-marker">
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(40, 40)">
            <!-- Outer pulse ring -->
            <circle cx="0" cy="0" r="25" fill="#3b82f6" opacity="0.2">
              <animate attributeName="r" from="15" to="30" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Middle ring -->
            <circle cx="0" cy="0" r="18" fill="#3b82f6" opacity="0.3"/>
            
            <!-- Inner dot -->
            <circle cx="0" cy="0" r="12" fill="#2563eb" stroke="white" stroke-width="3"/>
          </g>
        </svg>
      </div>
    `,
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -40],
  });
};

export const getAccessiblePinLabel = (type: 'available' | 'scheduled' | 'supply' | 'contractor') => {
  const labels = {
    available: 'Available job - Green pulsing pin',
    scheduled: 'Scheduled job - Blue pin with glow',
    supply: 'Supply house - Red pin with warehouse icon',
    contractor: 'Your location - Purple pin'
  };
  return labels[type];
};
