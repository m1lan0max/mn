import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = window.env?.SUPABASE_URL || "https://uoammzsxcsmazrvdkukl.supabase.co";
const SUPABASE_ANON_KEY =
  window.env?.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYW1tenN4Y3NtYXpydmRrdWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzEwMzQsImV4cCI6MjA4ODk0NzAzNH0.nsJ_qc-LHBe9T_vyPYTBUK5HJH5hn0iVOq1igJLrdnk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

