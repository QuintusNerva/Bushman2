import { useState, useEffect } from 'react';
import { offlineService } from '@/lib/offline';

interface UseOfflineState {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useOffline() {
  const [state, setState] = useState<UseOfflineState>({
    isOnline: offlineService.isOnline(),
    wasOffline: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      setState({
        isOnline: true,
        wasOffline: true,
      });

      setTimeout(() => {
        setState((prev) => ({ ...prev, wasOffline: false }));
      }, 3000);
    };

    const handleOffline = () => {
      setState({
        isOnline: false,
        wasOffline: false,
      });
    };

    const cleanup = offlineService.setupOnlineListener(
      handleOnline,
      handleOffline
    );

    return cleanup;
  }, []);

  return {
    ...state,
    cacheData: offlineService.setCacheItem.bind(offlineService),
    getCachedData: offlineService.getCacheItem.bind(offlineService),
    queueAction: offlineService.queueOfflineAction.bind(offlineService),
    getQueue: offlineService.getOfflineQueue.bind(offlineService),
    clearQueue: offlineService.clearOfflineQueue.bind(offlineService),
  };
}
