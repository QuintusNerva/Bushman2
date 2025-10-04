/*
  # Create Jobs and Travel Tracking Tables

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text) - RO, UV, Softener, etc.
      - `status` (text) - unclaimed, claimed, scheduled, traveling, arrived, in_progress, completed
      - `priority` (text) - low, medium, high, urgent
      - `description` (text, nullable)
      - `estimated_duration` (integer) - in hours
      - `scheduled_date` (timestamptz, nullable)
      - `customer_id` (uuid, references customers)
      - `contractor_id` (uuid, nullable, references auth.users)
      - `location_lat` (numeric)
      - `location_lng` (numeric)
      - `location_address` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, nullable)
      - `phone` (text)
      - `created_at` (timestamptz)

    - `travel_logs`
      - `id` (uuid, primary key)
      - `job_id` (uuid, references jobs)
      - `contractor_id` (uuid, references auth.users)
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz, nullable)
      - `total_seconds` (integer, nullable)
      - `start_location_lat` (numeric)
      - `start_location_lng` (numeric)
      - `end_location_lat` (numeric, nullable)
      - `end_location_lng` (numeric, nullable)
      - `arrival_method` (text, nullable) - auto or manual
      - `arrival_note` (text, nullable) - for analytics (e.g., outside_radius)
      - `distance_at_arrival` (integer, nullable) - in meters
      - `gps_permission` (text, default 'granted') - granted or denied
      - `synced_offline` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own jobs and travel logs
      - Update job status and travel logs
      - Insert travel logs
    - Contractors can view unclaimed jobs
    - Customers can only view their own jobs

  3. Indexes
    - Index on job status for quick filtering
    - Index on contractor_id for dashboard queries
    - Index on travel_logs job_id and contractor_id
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'unclaimed',
  priority text NOT NULL DEFAULT 'medium',
  description text,
  estimated_duration integer NOT NULL DEFAULT 2,
  scheduled_date timestamptz,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  contractor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  location_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create travel_logs table
CREATE TABLE IF NOT EXISTS travel_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  contractor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  total_seconds integer,
  start_location_lat numeric NOT NULL,
  start_location_lng numeric NOT NULL,
  end_location_lat numeric,
  end_location_lng numeric,
  arrival_method text,
  arrival_note text,
  distance_at_arrival integer,
  gps_permission text DEFAULT 'granted',
  synced_offline boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_contractor ON jobs(contractor_id);
CREATE INDEX IF NOT EXISTS idx_travel_logs_job ON travel_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_travel_logs_contractor ON travel_logs(contractor_id);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_logs ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Authenticated users can read customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Jobs policies
CREATE POLICY "Contractors can view unclaimed jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'unclaimed' OR contractor_id = auth.uid());

CREATE POLICY "Contractors can view their own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (contractor_id = auth.uid());

CREATE POLICY "Contractors can update their own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (contractor_id = auth.uid())
  WITH CHECK (contractor_id = auth.uid());

CREATE POLICY "Contractors can claim unclaimed jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (status = 'unclaimed')
  WITH CHECK (contractor_id = auth.uid());

-- Travel logs policies
CREATE POLICY "Contractors can view their own travel logs"
  ON travel_logs FOR SELECT
  TO authenticated
  USING (contractor_id = auth.uid());

CREATE POLICY "Contractors can create their own travel logs"
  ON travel_logs FOR INSERT
  TO authenticated
  WITH CHECK (contractor_id = auth.uid());

CREATE POLICY "Contractors can update their own travel logs"
  ON travel_logs FOR UPDATE
  TO authenticated
  USING (contractor_id = auth.uid())
  WITH CHECK (contractor_id = auth.uid());
