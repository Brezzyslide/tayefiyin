import { createClient } from '@supabase/supabase-js'

// Fetch Supabase config from backend since frontend env vars aren't accessible
let supabaseConfig: { url: string; anonKey: string } | null = null;

const getSupabaseConfig = async () => {
  if (supabaseConfig) return supabaseConfig;
  
  try {
    const response = await fetch('/api/config/supabase');
    if (response.ok) {
      supabaseConfig = await response.json();
      return supabaseConfig;
    }
  } catch (error) {
    console.warn('Failed to fetch Supabase config from backend');
  }
  
  return null;
};

// Initialize client dynamically when config is available
let supabaseClient: any = null;

const initializeSupabase = async () => {
  if (supabaseClient) return supabaseClient;
  
  const config = await getSupabaseConfig();
  if (config) {
    supabaseClient = createClient(config.url, config.anonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseClient;
};

export const supabase = {
  getInstance: initializeSupabase
};

// Real-time subscription helpers for care & support management
export const subscribeToMessages = async (companyId: number, callback: (payload: any) => void) => {
  const client = await initializeSupabase();
  if (!client) return null;
  
  return client
    .channel(`staff_messages_${companyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'staff_messages',
        filter: `company_id=eq.${companyId}`,
      },
      callback
    )
    .subscribe();
}

export const subscribeToWorkflowBoards = async (companyId: number, callback: (payload: any) => void) => {
  const client = await initializeSupabase();
  if (!client) return null;
  
  return client
    .channel(`workflow_boards_${companyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workflow_boards',
        filter: `company_id=eq.${companyId}`,
      },
      callback
    )
    .subscribe();
}

export const subscribeToWorkflowTasks = async (companyId: number, callback: (payload: any) => void) => {
  const client = await initializeSupabase();
  if (!client) return null;
  
  return client
    .channel(`workflow_tasks_${companyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workflow_tasks',
        filter: `company_id=eq.${companyId}`,
      },
      callback
    )
    .subscribe();
}

export const subscribeToMedicationAdministrations = async (clientId: number, callback: (payload: any) => void) => {
  const client = await initializeSupabase();
  if (!client) return null;
  
  return client
    .channel(`medication_administrations_${clientId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'medication_administrations',
        filter: `client_id=eq.${clientId}`,
      },
      callback
    )
    .subscribe();
}

export const subscribeToIncidents = async (companyId: number, callback: (payload: any) => void) => {
  const client = await initializeSupabase();
  if (!client) return null;
  
  return client
    .channel(`incidents_${companyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'incidents',
        filter: `company_id=eq.${companyId}`,
      },
      callback
    )
    .subscribe();
}