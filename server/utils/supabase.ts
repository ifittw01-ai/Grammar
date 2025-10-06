import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export const getSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()
  
  const supabaseUrl = config.supabaseUrl
  const supabaseKey = config.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are not configured')
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey)
  return supabaseClient
}

