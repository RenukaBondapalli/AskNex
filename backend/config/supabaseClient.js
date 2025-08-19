const { createClient } = require('@supabase/supabase-js');

// Replace with your actual values from Supabase dashboard
const supabaseUrl = 'https://kueumntadcdadbctnrul.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1ZXVtbnRhZGNkYWRiY3RucnVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI3NjIxOSwiZXhwIjoyMDY2ODUyMjE5fQ.hJHPLqhPERXGoe8a0NnS1pxbHD_jjhkqC4-2KhlwpXU';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
