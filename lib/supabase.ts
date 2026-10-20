import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// App tetap bisa dicoba tanpa Supabase; simpan jawaban akan aktif setelah env diisi.
export const supabase = url && key ? createClient(url, key) : null;