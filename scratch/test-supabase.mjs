import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqnpwyzhjdjyfclnokzh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbnB3eXpoamRqeWZjbG5va3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODE4NTUsImV4cCI6MjA5ODA1Nzg1NX0.Loozp0jG3qQSgkeqaykZky0JwmnLeooKKKZBV-exJmE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Menghubungkan ke Supabase...");
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*');
    
    if (error) {
      console.error("Error dari Supabase:", error);
    } else {
      console.log("Jumlah reviews di database:", data.length);
      console.log("Data ulasan:", data);
    }
  } catch (e) {
    console.error("Terjadi error sistem:", e);
  }
}

run();
