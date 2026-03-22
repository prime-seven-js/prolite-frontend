/**
 * Supabase client — dùng cho Realtime subscriptions và Storage (upload ảnh).
 * Chỉ dùng publishable key.
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ezgwsbdapqbuasodvycb.supabase.co",
  "sb_publishable_wZSRDc45UNlwG70jaqzYKA_-0_iO5BS",
);
