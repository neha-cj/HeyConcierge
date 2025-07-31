import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://udiuttnrrwnlksmldleo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaXV0dG5ycndubGtzbWxkbGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTY1MDIsImV4cCI6MjA2OTQzMjUwMn0.EMvANZmiGfyfpoKYFr-D4FRvvbOxzwOncCHVR_lDZp4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)