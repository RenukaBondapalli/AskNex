const { createClient } = require('@supabase/supabase-js');

// Replace with your actual values from Supabase dashboard
const supabaseUrl = '';
const supabaseKey = '';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
