import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hvpucldlltzrachgzpvf.supabase.co";
const supabaseAnonKey = "sb_publishable_uuJgQmkm0LOtacTyKf1VYg_kbpp0Iko";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);