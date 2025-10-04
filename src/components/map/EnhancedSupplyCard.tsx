import { useEffect, useRef, useState } from 'react';
import { Supplier } from '@/types';
import { X, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import './ProjectionCard.css';

interface EnhancedSupplyCardProps {
  supplier: Supplier;
  position: { x: number; y: number };
  pinColor: string;
  onClose: () => void;
  contractorLocation: { lat: number; lng: number };
}

export function EnhancedSupplyCard({
  supplier,
  position,
  pinColor,
  onClose,
  contractorLocation
}: EnhancedSupplyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [cardPosition, setCardPosition] = useState(position);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();

  const calculateDistance = () => {
    const R = 3959;
    const dLat = (supplier.location.lat - contractorLocation.lat) * Math.PI / 180;
    const dLon = (supplier.location.lng - contractorLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(contractorLocation.lat * Math.PI / 180) *
      Math.cos(supplier.location.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const calculateDriveTime = () => {
    const distance = parseFloat(calculateDistance());
    const avgSpeed = 35;
    const timeInHours = distance / avgSpeed;
    const minutes = Math.round(timeInHours * 60);
    return minutes < 1 ? '<1' : minutes.toString();
  };

  const getTodaysHours = () => {
    if (supplier.hours) {
      return `${supplier.hours.open} - ${supplier.hours.close}`;
    }
    return 'Hours not available';
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSetDestination = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${supplier.location.lat},${supplier.location.lng}`,
      '_blank'
    );
  };

  const handleCallStore = () => {
    window.location.href = `tel:${supplier.phone}`;
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      handleClose();
    }, 30000);
  };

  useEffect(() => {
    resetInactivityTimer();

    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      resetInactivityTimer();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        const startY = e.touches[0].clientY;
        const handleTouchMove = (moveEvent: TouchEvent) => {
          const deltaY = moveEvent.touches[0].clientY - startY;
          if (deltaY > 50) {
            handleClose();
            document.removeEventListener('touchmove', handleTouchMove);
          }
        };
        document.addEventListener('touchmove', handleTouchMove, { once: true });
      }
      resetInactivityTimer();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (position.x + rect.width > viewportWidth - 20) {
        adjustedX = viewportWidth - rect.width - 20;
      }
      if (position.y + rect.height > viewportHeight - 20) {
        adjustedY = viewportHeight - rect.height - 20;
      }

      if (adjustedX !== position.x || adjustedY !== position.y) {
        setCardPosition({ x: adjustedX, y: adjustedY });
      }
    }
  }, [position]);

  const distance = calculateDistance();
  const driveTime = calculateDriveTime();

  return (
    <>
      <svg className="projection-connector" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line
          x1={position.x}
          y1={position.y}
          x2={cardPosition.x + 20}
          y2={cardPosition.y + 20}
          stroke={pinColor}
          strokeWidth="2"
        />
      </svg>

      <div
        className="projection-card-container"
        style={{
          left: `${cardPosition.x}px`,
          top: `${cardPosition.y}px`
        }}
      >
        <div
          ref={cardRef}
          className={`projection-card ${isClosing ? 'closing' : ''}`}
          role="dialog"
          aria-label={`Supply house details for ${supplier.name}`}
          onMouseMove={resetInactivityTimer}
          onTouchMove={resetInactivityTimer}
        >
          <button
            className="card-close-button"
            onClick={handleClose}
            aria-label="Close card"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>

          <div className="projection-card-header">
            <div className="supply-house-name">
              <span>🏢</span>
              {supplier.name}
            </div>
          </div>

          <div className="projection-card-body card-scrollbar">
            <div className="card-info-row">
              <div className="card-info-icon">
                <MapPin size={16} />
              </div>
              <div className="card-info-text">
                <a
                  href="#"
                  className="card-clickable"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSetDestination();
                  }}
                  aria-label={`Get directions to ${supplier.name}`}
                >
                  {supplier.address}
                </a>
              </div>
            </div>

            <div className="card-info-row">
              <div className="card-info-icon">
                <Phone size={16} />
              </div>
              <div className="card-info-text">
                <a
                  href={`tel:${supplier.phone}`}
                  className="card-clickable"
                  onClick={handleCallStore}
                  aria-label={`Call ${supplier.name}`}
                >
                  {supplier.phone}
                </a>
              </div>
            </div>

            <div className="card-divider"></div>

            <div className="card-info-row">
              <div className="card-info-icon">
                <Clock size={16} />
              </div>
              <div className="card-info-text">
                <strong>Hours Today:</strong> {getTodaysHours()}
              </div>
            </div>

            <div className="card-info-row">
              <div className="card-info-icon">
                <Navigation size={16} />
              </div>
              <div className="card-info-text">
                <strong>Distance:</strong> {distance} miles
              </div>
            </div>

            <div className="card-info-row">
              <div className="card-info-icon">⏱️</div>
              <div className="card-info-text">
                <strong>Drive Time:</strong> ~{driveTime} minutes
              </div>
            </div>
          </div>

          <div className="projection-card-footer">
            <button
              className="card-button card-button-primary"
              onClick={handleSetDestination}
              aria-label={`Set ${supplier.name} as destination`}
            >
              SET AS DESTINATION
            </button>
            <button
              className="card-button card-button-secondary"
              onClick={handleCallStore}
              aria-label={`Call ${supplier.name}`}
            >
              <Phone size={18} />
              CALL STORE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
