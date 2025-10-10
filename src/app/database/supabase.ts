import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

export const supabase = createClient(environment.SUPABASE.URL, environment.SUPABASE.API_KEY);