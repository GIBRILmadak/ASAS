// Configuration Supabase
const SUPABASE_URL = 'https://bvwnkilxxffnqzjbdttm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2d25raWx4eGZmbnF6amJkdHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NjIxOTcsImV4cCI6MjA3NjIzODE5N30.5FV2mq94xYB7QSVzEH4UzOAW8LzULu0XyxnT8VV7RzM';

// Initialisation du client Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Rendre disponible globalement
window.supabase = supabaseClient;