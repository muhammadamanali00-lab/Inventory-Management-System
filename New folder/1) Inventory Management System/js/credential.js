// Apne Supabase project ka URL aur anon public key yahan likhein
// (Dashboard -> Project Settings -> API)
const PROJECTURL = `https://fbnljrgixkkpfcegfjov.supabase.co`;
const ANON_PUBLIC_KEY = `sb_publishable_DPyfAVezeSaPYIdSfJVtwg_qLW_EYlL`;

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(PROJECTURL, ANON_PUBLIC_KEY);
export default supabase;
