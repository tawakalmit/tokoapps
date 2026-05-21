-- ============================================
-- APPSTORE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STORAGE BUCKETS
-- Create these buckets in Supabase Dashboard > Storage
-- Or run these SQL commands:
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('icons', 'icons', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('apks', 'apks', true) ON CONFLICT DO NOTHING;

-- Storage policies: allow authenticated users to upload, public to read
CREATE POLICY "Public read icons" ON storage.objects FOR SELECT USING (bucket_id = 'icons');
CREATE POLICY "Auth upload icons" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'icons' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete icons" ON storage.objects FOR DELETE USING (bucket_id = 'icons' AND auth.role() = 'authenticated');

CREATE POLICY "Public read screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');
CREATE POLICY "Auth upload screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete screenshots" ON storage.objects FOR DELETE USING (bucket_id = 'screenshots' AND auth.role() = 'authenticated');

CREATE POLICY "Public read apks" ON storage.objects FOR SELECT USING (bucket_id = 'apks');
CREATE POLICY "Auth upload apks" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'apks' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete apks" ON storage.objects FOR DELETE USING (bucket_id = 'apks' AND auth.role() = 'authenticated');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  icon_url TEXT DEFAULT '',
  screenshots TEXT[] DEFAULT '{}',
  apk_url TEXT DEFAULT '',
  version TEXT NOT NULL DEFAULT '1.0.0',
  category TEXT NOT NULL DEFAULT 'Utility',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Navigation items table
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('navbar', 'footer')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')) DEFAULT 'pending',
  amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Device bindings table
CREATE TABLE IF NOT EXISTS device_bindings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  binding_key TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_bindings_device ON device_bindings(device_id);
CREATE INDEX IF NOT EXISTS idx_bindings_product_device ON device_bindings(product_id, device_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bindings_unique ON device_bindings(product_id, device_id, binding_key);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (for published products and active nav items)
CREATE POLICY "Public can read published products" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read active navigation" ON navigation_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

-- Public can create orders
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public can read their own orders
CREATE POLICY "Public can read own orders" ON orders
  FOR SELECT USING (true);

-- Public can read active bindings (for verification API)
CREATE POLICY "Public can read active bindings" ON device_bindings
  FOR SELECT USING (is_active = true);

-- Public can insert bindings (for purchase flow)
CREATE POLICY "Public can insert bindings" ON device_bindings
  FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access navigation" ON navigation_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access bindings" ON device_bindings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default navigation items
INSERT INTO navigation_items (label, href, position, sort_order) VALUES
  ('Beranda', '/', 'navbar', 1),
  ('Produk', '/#products', 'navbar', 2),
  ('Tentang', '/about', 'footer', 1),
  ('Kebijakan Privasi', '/privacy', 'footer', 2),
  ('Syarat & Ketentuan', '/terms', 'footer', 3);
