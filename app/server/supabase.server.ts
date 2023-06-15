import { createClient } from '@supabase/supabase-js';

const host = process.env.SUPABASE_HOST;
if(!host) throw new Error('SUPABASE_HOST envvar missing');

const apiKey = process.env.SUPABASE_API_KEY;
if (!apiKey) throw new Error('SUPABASE_API_KEY envvar missing');

const supabase = createClient(host, apiKey);

export default supabase;
