import { Job } from '@/types';

export interface TravelData {
  startedAt: string;
  startLocation: {
    lat: number;
    lng: number;
  };
  endedAt?: string;
  endLocation?: {
    lat: number;
    lng: number;
  };
  seconds?: number;
  arrivalMethod?: 'auto' | 'manual';
}

export interface StartTravelRequest {
  jobId: string;
  startLocation: {
    lat: number;
    lng: number;
  };
}

export interface EndTravelRequest {
  jobId: string;
  endLocation: {
    lat: number;
    lng: number;
  };
  seconds: number;
  arrivalMethod: 'auto' | 'manual';
}

export const startTravel = async (request: StartTravelRequest): Promise<Job> => {
  const travelData: Partial<TravelData> = {
    startedAt: new Date().toISOString(),
    startLocation: request.startLocation,
  };

  console.log('Starting travel for job:', request.jobId, travelData);

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: request.jobId,
    travel: travelData as TravelData,
  } as Job;
};

export const endTravel = async (request: EndTravelRequest): Promise<Job> => {
  const travelData: Partial<TravelData> = {
    endedAt: new Date().toISOString(),
    endLocation: request.endLocation,
    seconds: request.seconds,
    arrivalMethod: request.arrivalMethod,
  };

  console.log('Ending travel for job:', request.jobId, travelData);

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: request.jobId,
    travel: travelData as TravelData,
  } as Job;
};
