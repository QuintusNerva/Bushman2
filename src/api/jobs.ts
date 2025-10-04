import { Job } from '@/types';
import { supabase } from '@/lib/supabase';

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
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: travelLog, error: travelError } = await supabase
    .from('travel_logs')
    .insert({
      job_id: request.jobId,
      contractor_id: user.id,
      start_location_lat: request.startLocation.lat,
      start_location_lng: request.startLocation.lng,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (travelError) {
    console.error('Failed to create travel log:', travelError);
    throw travelError;
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .update({
      status: 'traveling',
      contractor_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', request.jobId)
    .select()
    .single();

  if (jobError) {
    console.error('Failed to update job status:', jobError);
    throw jobError;
  }

  return {
    id: job.id,
    travel: {
      startedAt: travelLog.started_at,
      startLocation: request.startLocation,
    },
  } as Job;
};

export const endTravel = async (request: EndTravelRequest & { distanceAtArrival?: number; isOutsideRadius?: boolean }): Promise<Job> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: travelLog, error: travelError } = await supabase
    .from('travel_logs')
    .select()
    .eq('job_id', request.jobId)
    .eq('contractor_id', user.id)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (travelError) {
    console.error('Failed to find travel log:', travelError);
    throw travelError;
  }

  if (!travelLog) {
    throw new Error('No active travel log found for this job');
  }

  const { error: updateError } = await supabase
    .from('travel_logs')
    .update({
      ended_at: new Date().toISOString(),
      end_location_lat: request.endLocation.lat,
      end_location_lng: request.endLocation.lng,
      total_seconds: request.seconds,
      arrival_method: request.arrivalMethod,
      arrival_note: request.isOutsideRadius ? 'outside_radius' : null,
      distance_at_arrival: request.distanceAtArrival,
    })
    .eq('id', travelLog.id);

  if (updateError) {
    console.error('Failed to update travel log:', updateError);
    throw updateError;
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .update({
      status: 'arrived',
      updated_at: new Date().toISOString(),
    })
    .eq('id', request.jobId)
    .select()
    .single();

  if (jobError) {
    console.error('Failed to update job status:', jobError);
    throw jobError;
  }

  return {
    id: job.id,
    travel: {
      endedAt: new Date().toISOString(),
      endLocation: request.endLocation,
      seconds: request.seconds,
      arrivalMethod: request.arrivalMethod,
    },
  } as Job;
};
