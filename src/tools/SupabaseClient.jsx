import {createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://qcgqnbovwktkbdbsiidk.supabase.co";
const supabaseAnonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ3FuYm92d2t0a2JkYnNpaWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODI5NDksImV4cCI6MjA2MDI1ODk0OX0.PGo2OtSd-_xGRYxK1E1ZdP5tbsJUEYUDscwHuoEzBrM";

export const supabase = createClient(supabaseUrl, supabaseAnonkey);