interface TravelInfoBarProps {
  distance: number;
  eta: Date | null;
  elapsedSeconds: number;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatETA = (eta: Date | null): string => {
  if (!eta) return '--:--';

  return eta.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export function TravelInfoBar({ distance, eta, elapsedSeconds }: TravelInfoBarProps) {
  return (
    <div className="absolute top-4 left-20 right-4 z-[1000] pointer-events-none">
      <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 px-6 py-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-600 mb-1">Distance</p>
            <p className="text-2xl font-bold text-gray-900">{distance.toFixed(1)} mi</p>
          </div>

          <div className="text-center border-x border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">ETA</p>
            <p className="text-2xl font-bold text-gray-900">{formatETA(eta)}</p>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-gray-600 mb-1">Travel Time</p>
            <p className="text-2xl font-bold text-gray-900">{formatTime(elapsedSeconds)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
