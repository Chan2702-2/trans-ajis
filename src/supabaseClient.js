import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iqnpwyzhjdjyfclnokzh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbnB3eXpoamRqeWZjbG5va3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODE4NTUsImV4cCI6MjA5ODA1Nzg1NX0.Loozp0jG3qQSgkeqaykZky0JwmnLeooKKKZBV-exJmE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
