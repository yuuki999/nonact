-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  cast_id TEXT NOT NULL,
  second_cast_id TEXT,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  date2 DATE,
  start_time2 TEXT,
  date3 DATE,
  start_time3 TEXT,
  alternate_time TEXT,
  duration INTEGER NOT NULL,
  location TEXT NOT NULL,
  meeting_location TEXT,
  budget TEXT,
  extension TEXT,
  payment_method TEXT,
  request TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own bookings
CREATE POLICY "Users can insert their own bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() = user_id);
