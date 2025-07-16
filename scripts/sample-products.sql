-- Insert sample products for testing
INSERT INTO public.products (name, description, price, category, sizes, colors, images, is_new, stock_quantity) VALUES
(
  'Classic White T-Shirt',
  'A timeless classic white t-shirt made from 100% organic cotton. Features a comfortable fit and durable construction that will last through countless washes.',
  29.99,
  'men',
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['White', 'Black', 'Gray'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  true,
  50
),
(
  'Slim Fit Jeans',
  'Modern slim fit jeans with a slight stretch for comfort. Features a classic five-pocket design and a versatile mid-wash that pairs well with anything.',
  59.99,
  'men',
  ARRAY['28', '30', '32', '34', '36'],
  ARRAY['Blue', 'Black', 'Gray'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  false,
  30
),
(
  'Summer Floral Dress',
  'A lightweight floral dress perfect for summer days. Features a flattering silhouette with a flowy skirt and adjustable straps.',
  79.99,
  'women',
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Floral Print', 'Blue', 'White'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  true,
  25
),
(
  'Casual Hoodie',
  'A comfortable casual hoodie perfect for everyday wear. Features a soft fleece lining and a relaxed fit for maximum comfort.',
  49.99,
  'men',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Gray', 'Black', 'Navy'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  false,
  40
),
(
  'Denim Jacket',
  'Classic denim jacket with a modern fit. Perfect for layering and adds a timeless style to any outfit.',
  89.99,
  'men',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Blue', 'Black', 'Light Blue'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  true,
  20
),
(
  'Pleated Skirt',
  'Elegant pleated skirt that can be dressed up or down. Made from high-quality fabric with a comfortable waistband.',
  45.99,
  'women',
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Black', 'Navy', 'Beige'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  false,
  35
),
(
  'Knit Sweater',
  'Cozy knit sweater perfect for cooler weather. Features a soft texture and relaxed fit for all-day comfort.',
  65.99,
  'women',
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Cream', 'Gray', 'Pink'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  true,
  30
),
(
  'Cargo Pants',
  'Functional cargo pants with multiple pockets. Made from durable fabric with a comfortable fit for active lifestyles.',
  55.99,
  'men',
  ARRAY['30', '32', '34', '36', '38'],
  ARRAY['Khaki', 'Black', 'Olive'],
  ARRAY['/placeholder.svg?height=600&width=600'],
  false,
  45
);
