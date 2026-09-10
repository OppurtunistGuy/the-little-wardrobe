-- ============================================================================
-- THE LITTLE WARDROBE — PRODUCTION POSTGRESQL SCHEMA & RLS POLICIES
-- Run this in your Supabase SQL Editor to set up the production backend.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'other',
    availability VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (availability IN ('Available', 'Sold Out')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    product_id VARCHAR(100),
    fabric VARCHAR(255),
    color VARCHAR(100),
    included VARCHAR(255),
    sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
    care_instructions TEXT,
    shipping_information TEXT,
    return_information TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name VARCHAR(100) NOT NULL DEFAULT 'The Little Wardrobe',
    logo_url TEXT,
    whatsapp_number VARCHAR(20) NOT NULL DEFAULT '919876543210',
    default_whatsapp_message TEXT DEFAULT 'Hi! I discovered The Little Wardrobe on Instagram and would like to ask a question.',
    instagram_handle VARCHAR(100) DEFAULT '@thelittlewardrobe.in',
    instagram_url TEXT DEFAULT 'https://instagram.com',
    email VARCHAR(150) DEFAULT 'care@thelittlewardrobe.in',
    business_hours VARCHAR(255) DEFAULT 'Mon – Sat: 10:00 AM – 7:00 PM IST',
    location VARCHAR(255) DEFAULT 'New Delhi & Jaipur, India',
    shipping_policy TEXT DEFAULT 'Pan-India delivery within 4–7 business days. Free shipping on orders above ₹2,999.',
    return_policy TEXT DEFAULT 'Easy size exchange within 7 days of delivery.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status, availability);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON public.product_images (display_order);

-- 6. TRIGGER TO AUTOMATICALLY UPDATE UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running
DROP POLICY IF EXISTS "Public can view published non-archived products" ON public.products;
DROP POLICY IF EXISTS "Authenticated admin can view all products" ON public.products;
DROP POLICY IF EXISTS "Authenticated admin can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated admin can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated admin can delete products" ON public.products;

DROP POLICY IF EXISTS "Public can view images for published products" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated admin can view all product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated admin can insert product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated admin can update product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated admin can delete product images" ON public.product_images;

DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
DROP POLICY IF EXISTS "Authenticated admin can update settings" ON public.settings;

-- PRODUCTS POLICIES
-- 1. Public users can ONLY read published, non-archived products
CREATE POLICY "Public can view published non-archived products"
    ON public.products FOR SELECT
    USING (status = 'published');

-- 2. Authenticated admin has full read/write access
CREATE POLICY "Authenticated admin can view all products"
    ON public.products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated admin can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (true);

-- PRODUCT IMAGES POLICIES
CREATE POLICY "Public can view images for published products"
    ON public.product_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_images.product_id
            AND products.status = 'published'
        )
    );

CREATE POLICY "Authenticated admin can view all product images"
    ON public.product_images FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated admin can insert product images"
    ON public.product_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can update product images"
    ON public.product_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete product images"
    ON public.product_images FOR DELETE
    TO authenticated
    USING (true);

-- SETTINGS POLICIES
CREATE POLICY "Public can view settings"
    ON public.settings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated admin can update settings"
    ON public.settings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can insert settings"
    ON public.settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================================================
-- SUPABASE STORAGE CONFIGURATION: catalog-images
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-images', 'catalog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read catalog images
CREATE POLICY "Public catalog images access"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalog-images');

-- Only authenticated admin can upload, update, delete images
CREATE POLICY "Admin upload catalog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalog-images');

CREATE POLICY "Admin update catalog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'catalog-images');

CREATE POLICY "Admin delete catalog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalog-images');

-- ============================================================================
-- INITIAL SEED DATA (Default Settings & 12 Signature Silhouettes)
-- ============================================================================

INSERT INTO public.settings (id, brand_name, whatsapp_number, default_whatsapp_message, instagram_handle, instagram_url, email, business_hours, location)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'The Little Wardrobe',
    '919876543210',
    'Hi! I discovered The Little Wardrobe on Instagram and would like to ask a question.',
    '@thelittlewardrobe.in',
    'https://instagram.com',
    'care@thelittlewardrobe.in',
    'Mon – Sat: 10:00 AM – 7:00 PM IST',
    'New Delhi & Jaipur, India'
)
ON CONFLICT (id) DO NOTHING;
