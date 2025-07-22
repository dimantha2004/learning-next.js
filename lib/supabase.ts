import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrhsohlmwywtaenbrjfh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyaHNvaGxtd3l3dGFlbmJyamZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTcwMjcsImV4cCI6MjA2ODQ5MzAyN30.M8ZsC9zB0O9pXDUtysovn5iSdq31T0M7D-8D0wBqGbo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('image')
    .upload(fileName, file);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('image')
    .getPublicUrl(data.path);

  return publicUrl;
};

export type Database = {
  public: {
    Tables: {
      stripe_customers: {
        Row: {
          id: number;
          user_id: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          user_id: string;
          customer_id: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          user_id?: string;
          customer_id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      stripe_subscriptions: {
        Row: {
          id: number;
          customer_id: string;
          subscription_id: string | null;
          price_id: string | null;
          current_period_start: number | null;
          current_period_end: number | null;
          cancel_at_period_end: boolean;
          payment_method_brand: string | null;
          payment_method_last4: string | null;
          status: 'not_started' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          customer_id: string;
          subscription_id?: string | null;
          price_id?: string | null;
          current_period_start?: number | null;
          current_period_end?: number | null;
          cancel_at_period_end?: boolean;
          payment_method_brand?: string | null;
          payment_method_last4?: string | null;
          status: 'not_started' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          customer_id?: string;
          subscription_id?: string | null;
          price_id?: string | null;
          current_period_start?: number | null;
          current_period_end?: number | null;
          cancel_at_period_end?: boolean;
          payment_method_brand?: string | null;
          payment_method_last4?: string | null;
          status?: 'not_started' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      stripe_orders: {
        Row: {
          id: number;
          checkout_session_id: string;
          payment_intent_id: string;
          customer_id: string;
          amount_subtotal: number;
          amount_total: number;
          currency: string;
          payment_status: string;
          status: 'pending' | 'completed' | 'canceled';
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          checkout_session_id: string;
          payment_intent_id: string;
          customer_id: string;
          amount_subtotal: number;
          amount_total: number;
          currency: string;
          payment_status: string;
          status?: 'pending' | 'completed' | 'canceled';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          checkout_session_id?: string;
          payment_intent_id?: string;
          customer_id?: string;
          amount_subtotal?: number;
          amount_total?: number;
          currency?: string;
          payment_status?: string;
          status?: 'pending' | 'completed' | 'canceled';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
    };
    Views: {
      stripe_user_subscriptions: {
        Row: {
          customer_id: string;
          subscription_id: string | null;
          subscription_status: 'not_started' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
          price_id: string | null;
          current_period_start: number | null;
          current_period_end: number | null;
          cancel_at_period_end: boolean;
          payment_method_brand: string | null;
          payment_method_last4: string | null;
        };
      };
      stripe_user_orders: {
        Row: {
          customer_id: string;
          order_id: number;
          checkout_session_id: string;
          payment_intent_id: string;
          amount_subtotal: number;
          amount_total: number;
          currency: string;
          payment_status: string;
          order_status: 'pending' | 'completed' | 'canceled';
          order_date: string;
        };
      };
    };
  };
};