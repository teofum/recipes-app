import { createClient } from '@supabase/supabase-js';

const apiKey = process.env.SUPABASE_API_KEY;
if (!apiKey) throw new Error('SUPABASE_API_KEY envvar missing');

const supabase = createClient(
  'https://tnfykxgkmfigvbcikbeb.supabase.co',
  apiKey,
);

export default supabase;
