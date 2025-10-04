import { create } from 'zustand';

export type TravelState = 'ACCEPTED' | 'TRAVELING' | 'ARRIVED';
export type ArrivalMethod = 'auto' | 'manual';

interface TravelUIState {
  travelState: TravelState;
  startTime: number | null;
  elapsedSeconds: number;
  isGeofenceActive: boolean;
  geofenceTimer: number;
  showArrivalConfirm: boolean;
}

interface AppStore {
  travelUI: TravelUIState;
  setTravelState: (state: TravelState) => void;
  startTravel: () => void;
  incrementElapsed: () => void;
  setGeofenceActive: (active: boolean) => void;
  incrementGeofenceTimer: () => void;
  resetGeofenceTimer: () => void;
  setShowArrivalConfirm: (show: boolean) => void;
  resetTravel: () => void;
}

const initialTravelState: TravelUIState = {
  travelState: 'ACCEPTED',
  startTime: null,
  elapsedSeconds: 0,
  isGeofenceActive: false,
  geofenceTimer: 0,
  showArrivalConfirm: false,
};

export const useAppStore = create<AppStore>((set) => ({
  travelUI: initialTravelState,

  setTravelState: (state) =>
    set((store) => ({
      travelUI: { ...store.travelUI, travelState: state },
    })),

  startTravel: () =>
    set((store) => ({
      travelUI: {
        ...store.travelUI,
        travelState: 'TRAVELING',
        startTime: Date.now(),
        elapsedSeconds: 0,
      },
    })),

  incrementElapsed: () =>
    set((store) => ({
      travelUI: {
        ...store.travelUI,
        elapsedSeconds: store.travelUI.elapsedSeconds + 1,
      },
    })),

  setGeofenceActive: (active) =>
    set((store) => ({
      travelUI: { ...store.travelUI, isGeofenceActive: active },
    })),

  incrementGeofenceTimer: () =>
    set((store) => ({
      travelUI: {
        ...store.travelUI,
        geofenceTimer: store.travelUI.geofenceTimer + 1,
      },
    })),

  resetGeofenceTimer: () =>
    set((store) => ({
      travelUI: { ...store.travelUI, geofenceTimer: 0 },
    })),

  setShowArrivalConfirm: (show) =>
    set((store) => ({
      travelUI: { ...store.travelUI, showArrivalConfirm: show },
    })),

  resetTravel: () =>
    set(() => ({
      travelUI: initialTravelState,
    })),
}));
