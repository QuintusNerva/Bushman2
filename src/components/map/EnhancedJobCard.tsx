import { useEffect, useRef, useState } from 'react';
import { Job } from '@/types';
import { X, MapPin, Phone, Clock, Wrench, Navigation } from 'lucide-react';
import './ProjectionCard.css';
import { PIN_COLORS } from './MapMarkers';

interface EnhancedJobCardProps {
  job: Job;
  position: { x: number; y: number };
  pinColor: string;
  onClose: () => void;
  onAccept: (jobId: string) => void;
  contractorLocation: { lat: number; lng: number };
}

export function EnhancedJobCard({
  job,
  position,
  pinColor,
  onClose,
  onAccept,
  contractorLocation
}: EnhancedJobCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [cardPosition, setCardPosition] = useState(position);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();

  const calculateDistance = () => {
    const R = 3959;
    const dLat = (job.location.lat - contractorLocation.lat) * Math.PI / 180;
    const dLon = (job.location.lng - contractorLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(contractorLocation.lat * Math.PI / 180) *
      Math.cos(job.location.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const getPriorityClass = (priority: string) => {
    const classes = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };
    return classes[priority as keyof typeof classes] || 'priority-medium';
  };

  const formatJobType = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatScheduledTime = () => {
    if (job.status === 'unclaimed') return 'Available Now';
    if (job.scheduledDate) {
      const date = new Date(job.scheduledDate);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
    return 'TBD';
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleAccept = () => {
    onAccept(job.id);
    handleClose();
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${job.customer.phone}`;
  };

  const handleDirectionsClick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${job.location.lat},${job.location.lng}`,
      '_blank'
    );
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
          aria-label={`Job details for ${job.customer.name}`}
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
            <div className="job-id-header">
              JOB #{job.id.slice(0, 8).toUpperCase()}
              <span className={`priority-badge ${getPriorityClass(job.priority)}`} style={{ marginLeft: '8px' }}>
                {job.priority}
              </span>
            </div>
            <div className="customer-name">{job.customer.name}</div>
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
                    handleDirectionsClick();
                  }}
                  aria-label={`Get directions to ${job.location.address}`}
                >
                  {job.location.address}
                </a>
              </div>
            </div>

            <div className="card-info-row">
              <div className="card-info-icon">
                <Phone size={16} />
              </div>
              <div className="card-info-text">
                <a
                  href={`tel:${job.customer.phone}`}
                  className="card-clickable"
                  onClick={handlePhoneClick}
                  aria-label={`Call ${job.customer.name}`}
                >
                  {job.customer.phone}
                </a>
              </div>
            </div>

            <div className="card-divider"></div>

            <div className="card-info-row">
              <div className="card-info-icon">
                <Wrench size={16} />
              </div>
              <div className="card-info-text">
                <strong>Type:</strong> {formatJobType(job.type)}
              </div>
            </div>

            {job.description && (
              <div className="description-text">
                {job.description}
              </div>
            )}

            <div className="card-info-row" style={{ marginTop: '12px' }}>
              <div className="card-info-icon">
                <Clock size={16} />
              </div>
              <div className="card-info-text">
                <strong>Scheduled:</strong> {formatScheduledTime()}
              </div>
            </div>

            <div className="card-info-row">
              <div className="card-info-icon">⏱️</div>
              <div className="card-info-text">
                <strong>Duration:</strong> {job.estimatedDuration} minutes
              </div>
            </div>

            <div className="card-info-row">
              <div className="card-info-icon">🔧</div>
              <div className="card-info-text">
                <strong>Parts Needed:</strong> TBD
              </div>
            </div>

            <div className="card-info-row">
              <div className="card-info-icon">
                <Navigation size={16} />
              </div>
              <div className="card-info-text">
                <strong>Distance:</strong> {distance} miles from your location
              </div>
            </div>
          </div>

          <div className="projection-card-footer">
            <button
              className="card-button card-button-primary"
              onClick={handleAccept}
              aria-label={`Accept job for ${job.customer.name}`}
            >
              ACCEPT JOB
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
