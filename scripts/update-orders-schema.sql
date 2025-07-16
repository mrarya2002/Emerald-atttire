-- Update orders table to include more detailed shipping address
ALTER TABLE public.orders 
ALTER COLUMN shipping_address TYPE JSONB;

-- Add sample orders for testing (optional)
-- Note: Replace user_id with actual user IDs from your users table
INSERT INTO public.orders (user_id, total_amount, status, shipping_address) VALUES
(
  (SELECT id FROM public.users WHERE role = 'user' LIMIT 1),
  129.98,
  'pending',
  '{
    "firstName": "John",
    "lastName": "Doe", 
    "address": "123 Main St",
    "apartment": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "phone": "+1 (555) 123-4567"
  }'::jsonb
),
(
  (SELECT id FROM public.users WHERE role = 'user' LIMIT 1),
  79.99,
  'processing',
  '{
    "firstName": "Jane",
    "lastName": "Smith",
    "address": "456 Oak Ave",
    "city": "Los Angeles", 
    "state": "CA",
    "zip": "90210",
    "phone": "+1 (555) 987-6543"
  }'::jsonb
);

-- Add sample order items (optional)
-- Note: Replace product_id with actual product IDs from your products table
INSERT INTO public.order_items (order_id, product_id, quantity, price, selected_size, selected_color)
SELECT 
  o.id,
  p.id,
  2,
  p.price,
  'M',
  'Blue'
FROM public.orders o
CROSS JOIN public.products p
WHERE p.category = 'men'
LIMIT 3;
