import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkjcauqvxlfjejtqzbcb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhramNhdXF2eGxmamVqdHF6YmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzUxODIsImV4cCI6MjA1ODUxMTE4Mn0.g2031CwkI7xWVgtH-1AL3WZ7son2DxP4hsz7ZS38uFI';

export const supabase = createClient(supabaseUrl, supabaseKey);