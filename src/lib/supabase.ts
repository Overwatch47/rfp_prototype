import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type RFP = {
  id: string;
  title: string;
  source: string;
  due_date: string;
  scope: string;
  requirements: string;
  testing_needs: string;
  status: 'detected' | 'analyzed' | 'matched' | 'priced' | 'submitted';
  match_percentage: number;
  total_price: number;
  created_at: string;
  updated_at: string;
};

export type SKUProduct = {
  id: string;
  sku_code: string;
  product_name: string;
  voltage: string;
  conductor_type: string;
  insulation: string;
  price_per_meter: number;
  test_cost: number;
  stock_available: boolean;
  created_at: string;
};

export type RFPMatch = {
  id: string;
  rfp_id: string;
  sku_id: string;
  match_score: number;
  quantity: number;
  total_material_cost: number;
  total_test_cost: number;
  subtotal: number;
  recommended: boolean;
  created_at: string;
};

export type AgentLog = {
  id: string;
  rfp_id: string;
  agent_name: 'sales' | 'technical' | 'pricing' | 'orchestrator';
  action: string;
  status: 'active' | 'processing' | 'completed';
  details: Record<string, any>;
  timestamp: string;
};
