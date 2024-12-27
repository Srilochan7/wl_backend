const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      console.log('Received email:', email);
      
      // Insert email into the Supabase table
      const { data, error } = await supabase
        .from('emails')  // Ensure this matches your Supabase table
        .insert([{ email, created_at: new Date() }]);
      
      if (error) {
        throw error;
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
};
