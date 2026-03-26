/**
 * Supabase client — dùng cho Realtime subscriptions và Storage (upload ảnh).
 * Chỉ dùng publishable key.
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ezgwsbdapqbuasodvycb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Z3dzYmRhcHFidWFzb2R2eWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzYzOTIsImV4cCI6MjA4NjIxMjM5Mn0.pRKNC3tAGaUbnHtUBw6gSRVui19Y-YSbTsWZgMZl6cY",
);
