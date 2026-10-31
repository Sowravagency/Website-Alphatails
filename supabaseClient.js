import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xukjlwsidurvtxqouqvd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1a2psd3NpZHVydnR4cW91cXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODg2MjMsImV4cCI6MjEwODk2NDYyM30.QQXkTVzouEci79c5DRNTLIREfReSmCDhiVQCl8et-us"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
