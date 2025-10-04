import L from 'leaflet';

export const PIN_COLORS = {
  available: '#00C851',
  scheduled: '#1976D2',
  supplyHouse: '#D32F2F',
  selected: '#FFD700',
  contractor: '#8b5cf6'
} as const;

const createAnimatedMarker = (
  color: string,
  isAvailable = false,
  isSelected = false,
  icon?: string
) => {
  const pulseAnimation = isAvailable ? `
    @keyframes pulse-${color.replace('#', '')} {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }
  ` : '';

  const selectionRing = isSelected ? `
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 36px;
      height: 36px;
      border: 3px solid ${PIN_COLORS.selected};
      border-radius: 50%;
      animation: pulse-ring 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      pointer-events: none;
    "></div>
    <style>
      @keyframes pulse-ring {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
      }
    </style>
  ` : '';

  const iconOverlay = icon ? `
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
      pointer-events: none;
      z-index: 2;
    ">${icon}</div>
  ` : '';

  const scale = isSelected ? 1.2 : 1;
  const glowEffect = color === PIN_COLORS.scheduled ?
    `0 0 1px 1px rgba(25, 118, 210, 0.4), 0 2px 5px rgba(0,0,0,0.3)` :
    `0 2px 5px rgba(0,0,0,0.3)`;

  return L.divIcon({
    className: 'custom-animated-marker',
    html: `
      <style>
        ${pulseAnimation}
        .marker-container-${color.replace('#', '')} {
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-pin-${color.replace('#', '')} {
          background-color: ${color};
          width: ${24 * scale}px;
          height: ${24 * scale}px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: ${glowEffect};
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          position: relative;
          z-index: 1;
          ${isAvailable ? `animation: pulse-${color.replace('#', '')} 2s ease-in-out infinite;` : ''}
        }
        .marker-pin-${color.replace('#', '')}:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
      </style>
      <div class="marker-container-${color.replace('#', '')}">
        ${selectionRing}
        <div class="marker-pin-${color.replace('#', '')}">
          ${iconOverlay}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const createJobMarker = (status: string, isSelected = false) => {
  const isAvailable = status === 'unclaimed';
  const color = isAvailable ? PIN_COLORS.available : PIN_COLORS.scheduled;
  return createAnimatedMarker(color, isAvailable, isSelected);
};

export const createSupplierMarker = (isSelected = false) => {
  return createAnimatedMarker(PIN_COLORS.supplyHouse, false, isSelected, '🏢');
};

export const createContractorMarker = () => {
  return createAnimatedMarker(PIN_COLORS.contractor, false, false, '📍');
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
