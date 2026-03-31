
-- Create receipts table for shared history
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_no TEXT NOT NULL,
  date TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount TEXT NOT NULL,
  through TEXT NOT NULL,
  on_account_of TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Allow public read/write since this is a simple internal app with fixed credentials
CREATE POLICY "Allow public read" ON public.receipts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.receipts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.receipts FOR DELETE USING (true);

-- Create a counter table to sync receipt counter across devices
CREATE TABLE public.receipt_counter (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  counter INTEGER NOT NULL DEFAULT 1
);

ALTER TABLE public.receipt_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read counter" ON public.receipt_counter FOR SELECT USING (true);
CREATE POLICY "Allow public update counter" ON public.receipt_counter FOR UPDATE USING (true);
CREATE POLICY "Allow public insert counter" ON public.receipt_counter FOR INSERT WITH CHECK (true);

-- Insert initial counter
INSERT INTO public.receipt_counter (id, counter) VALUES (1, 1);
