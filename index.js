require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', SUPABASE_URL ? 'Present' : 'Missing');
console.log('Supabase Key:', SUPABASE_KEY ? 'Present' : 'Missing');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.post('/api/waitlist', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received email:', email);
    
    // Test Supabase connection
    const { data: test, error: testError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('Connection test error:', testError);
      throw testError;
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ emails: email, created_at: new Date() }])
      .select();

    console.log('Insert attempt:', { data, error });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error('Full error details:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));