/*
  # Agentic AI RFP Response System Database Schema

  1. New Tables
    - `rfps`
      - `id` (uuid, primary key)
      - `title` (text) - RFP title
      - `source` (text) - Website/source URL
      - `due_date` (date) - Submission deadline
      - `scope` (text) - Project scope description
      - `requirements` (text) - Technical requirements
      - `testing_needs` (text) - Testing requirements
      - `status` (text) - detected, analyzed, matched, priced, submitted
      - `match_percentage` (numeric) - Overall match score
      - `total_price` (numeric) - Final calculated price
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sku_products`
      - `id` (uuid, primary key)
      - `sku_code` (text) - Product SKU identifier
      - `product_name` (text) - Product name
      - `voltage` (text) - Voltage specification
      - `conductor_type` (text) - Conductor material/type
      - `insulation` (text) - Insulation type
      - `price_per_meter` (numeric) - Base price
      - `test_cost` (numeric) - Testing cost
      - `stock_available` (boolean)
      - `created_at` (timestamptz)

    - `rfp_matches`
      - `id` (uuid, primary key)
      - `rfp_id` (uuid, foreign key) - Reference to rfps
      - `sku_id` (uuid, foreign key) - Reference to sku_products
      - `match_score` (numeric) - Percentage match
      - `quantity` (numeric) - Required quantity
      - `total_material_cost` (numeric)
      - `total_test_cost` (numeric)
      - `subtotal` (numeric)
      - `recommended` (boolean) - Top 3 recommendation
      - `created_at` (timestamptz)

    - `agent_logs`
      - `id` (uuid, primary key)
      - `rfp_id` (uuid, foreign key) - Reference to rfps
      - `agent_name` (text) - sales, technical, pricing, orchestrator
      - `action` (text) - Action performed
      - `status` (text) - active, processing, completed
      - `details` (jsonb) - Additional data
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (demo prototype)

  3. Important Notes
    - This schema supports the full RFP workflow from detection to submission
    - Agent logs track all interactions for visualization
    - Match scores enable spec comparison visualization
    - All monetary values stored as numeric for precision
*/

-- Create RFPs table
CREATE TABLE IF NOT EXISTS rfps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source text NOT NULL,
  due_date date NOT NULL,
  scope text DEFAULT '',
  requirements text DEFAULT '',
  testing_needs text DEFAULT '',
  status text DEFAULT 'detected',
  match_percentage numeric DEFAULT 0,
  total_price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create SKU Products table
CREATE TABLE IF NOT EXISTS sku_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code text UNIQUE NOT NULL,
  product_name text NOT NULL,
  voltage text DEFAULT '',
  conductor_type text DEFAULT '',
  insulation text DEFAULT '',
  price_per_meter numeric DEFAULT 0,
  test_cost numeric DEFAULT 0,
  stock_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create RFP Matches table
CREATE TABLE IF NOT EXISTS rfp_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id uuid REFERENCES rfps(id) ON DELETE CASCADE,
  sku_id uuid REFERENCES sku_products(id) ON DELETE CASCADE,
  match_score numeric DEFAULT 0,
  quantity numeric DEFAULT 0,
  total_material_cost numeric DEFAULT 0,
  total_test_cost numeric DEFAULT 0,
  subtotal numeric DEFAULT 0,
  recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create Agent Logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id uuid REFERENCES rfps(id) ON DELETE CASCADE,
  agent_name text NOT NULL,
  action text NOT NULL,
  status text DEFAULT 'processing',
  details jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfp_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo prototype)
CREATE POLICY "Public read access for rfps"
  ON rfps FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for sku_products"
  ON sku_products FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for rfp_matches"
  ON rfp_matches FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for agent_logs"
  ON agent_logs FOR SELECT
  TO anon
  USING (true);

-- Insert sample SKU products
INSERT INTO sku_products (sku_code, product_name, voltage, conductor_type, insulation, price_per_meter, test_cost, stock_available) VALUES
  ('WC-1100-CU-PVC', '1.1kV Copper PVC Cable', '1.1kV', 'Copper', 'PVC', 125.50, 5000, true),
  ('WC-1100-AL-XLPE', '1.1kV Aluminum XLPE Cable', '1.1kV', 'Aluminum', 'XLPE', 95.75, 5500, true),
  ('WC-3300-CU-XLPE', '3.3kV Copper XLPE Cable', '3.3kV', 'Copper', 'XLPE', 285.00, 8000, true),
  ('WC-6600-CU-XLPE', '6.6kV Copper XLPE Cable', '6.6kV', 'Copper', 'XLPE', 425.50, 12000, true),
  ('WC-11000-AL-XLPE', '11kV Aluminum XLPE Cable', '11kV', 'Aluminum', 'XLPE', 350.25, 15000, true),
  ('WC-11000-CU-XLPE', '11kV Copper XLPE Cable', '11kV', 'Copper', 'XLPE', 520.00, 15000, true),
  ('WC-33000-CU-XLPE', '33kV Copper XLPE Cable', '33kV', 'Copper', 'XLPE', 1250.00, 25000, true),
  ('WC-450-CU-PVC', '450V Copper PVC Cable', '450/750V', 'Copper', 'PVC', 45.00, 2500, true);

-- Insert sample RFPs
INSERT INTO rfps (title, source, due_date, scope, requirements, testing_needs, status, match_percentage, total_price) VALUES
  (
    'Industrial Cable Supply - Mumbai Metro Phase 3',
    'https://mahadiscom.procurement.gov.in',
    '2025-11-15',
    'Supply of 11kV XLPE insulated power cables for metro underground sections. Total requirement: 25,000 meters.',
    'Voltage: 11kV, Conductor: Copper, Insulation: XLPE, IS 7098 Part 2 compliant, Flame retardant',
    'Type tests: High voltage test, Partial discharge test, Fire resistance test',
    'analyzed',
    94.5,
    14525000
  ),
  (
    'Power Distribution Network - Bangalore Smart City',
    'https://bescom.karnataka.gov.in/tenders',
    '2025-11-28',
    'Installation of 1.1kV and 3.3kV distribution cables across 15km smart city corridor.',
    'Mixed voltage requirement: 1.1kV (10km) and 3.3kV (5km), Aluminum conductor acceptable, Weather resistant',
    'Routine electrical tests, Environmental stress testing',
    'matched',
    88.2,
    2382500
  ),
  (
    'Solar Farm Grid Connection - Rajasthan',
    'https://energy.rajasthan.gov.in/rfp',
    '2025-12-10',
    '33kV transmission cables for connecting 100MW solar farm to state grid. Underground laying.',
    'Voltage: 33kV, High temperature resistance, UV stabilized, Copper conductor preferred',
    'Temperature cycling, UV resistance, Mechanical stress tests',
    'detected',
    0,
    0
  ),
  (
    'Residential Complex Wiring - Pune Township',
    'https://pmrda.tenders.gov.in',
    '2025-10-30',
    'Internal wiring for 500 residential units. Low voltage household cables.',
    'Voltage: 450/750V, Copper conductor, ISI marked, Flame retardant PVC',
    'Standard IS certification tests',
    'priced',
    96.8,
    1687500
  );

-- Insert sample agent logs
INSERT INTO agent_logs (rfp_id, agent_name, action, status, details) 
SELECT 
  id,
  'sales',
  'RFP Identified',
  'completed',
  jsonb_build_object('source', source, 'due_date', due_date)
FROM rfps;

INSERT INTO agent_logs (rfp_id, agent_name, action, status, details)
SELECT 
  id,
  'technical',
  'Spec Analysis',
  CASE WHEN status IN ('matched', 'priced') THEN 'completed' ELSE 'processing' END,
  jsonb_build_object('match_score', match_percentage)
FROM rfps
WHERE status != 'detected';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rfps_status ON rfps(status);
CREATE INDEX IF NOT EXISTS idx_rfps_due_date ON rfps(due_date);
CREATE INDEX IF NOT EXISTS idx_agent_logs_rfp_id ON agent_logs(rfp_id);
CREATE INDEX IF NOT EXISTS idx_rfp_matches_rfp_id ON rfp_matches(rfp_id);