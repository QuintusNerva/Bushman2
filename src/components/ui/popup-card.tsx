import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PopupCardProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function PopupCard({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = '80vw',
  maxHeight = '80vh',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: PopupCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setIsVisible(true);
      setIsAnimating(true);

      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      setIsAnimating(false);

      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';

        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 300);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = cardRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300',
        isAnimating ? 'opacity-100' : 'opacity-0'
      )}
      style={{ zIndex: 99999 }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || 'Pop-up dialog'}
      aria-describedby={ariaDescribedBy}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        ref={cardRef}
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300',
          'flex flex-col overflow-hidden',
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className
        )}
        style={{
          maxWidth,
          maxHeight,
          width: '100%',
        }}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
            {title && (
              <h2 className="text-xl font-bold text-slate-900 pr-8">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-center',
                  'w-10 h-10 rounded-full',
                  'bg-slate-100 hover:bg-slate-200',
                  'text-slate-600 hover:text-slate-900',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  title ? 'ml-auto' : 'ml-auto'
                )}
                aria-label="Close dialog"
                type="button"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto overflow-x-hidden flex-1 p-6 custom-scrollbar">
          {children}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
        `
      }} />
    </div>
  );
}

export function usePopupCard() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
