import { supabase, isSupabaseConfigured } from './supabaseClient';
import { products as initialSeedProducts } from '../data/products';
import { brandConfig as initialSeedSettings } from '../config/brandConfig';

const LOCAL_STORAGE_KEY_PRODUCTS = 'tlw_local_products';
const LOCAL_STORAGE_KEY_SETTINGS = 'tlw_local_settings';

// Helper: generate URL-friendly slug
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Client-side image compression utility
export async function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Image compression failed.'));
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for compression.'));
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
  });
}

// -----------------------------------------------------------------------------
// LOCAL DEV PROTOTYPE STORAGE ENGINE
// Only used when isSupabaseConfigured === false
// -----------------------------------------------------------------------------
function getLocalProducts() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
  if (!data) {
    // Seed with initial products
    const seeded = initialSeedProducts.map((p, idx) => ({
      ...p,
      id: p.id || `prod-${idx + 1}`,
      status: p.availability === 'Sold Out' ? 'published' : (p.status || 'published'),
      display_order: idx + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveLocalProducts(products) {
  localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

function getLocalSettings() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(initialSeedSettings));
    return initialSeedSettings;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return initialSeedSettings;
  }
}

function saveLocalSettings(settings) {
  localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

// -----------------------------------------------------------------------------
// UNIFIED CATALOG SERVICE
// -----------------------------------------------------------------------------
export const catalogService = {
  isUsingSupabase: isSupabaseConfigured,

  /**
   * Fetch public products (strictly published & non-archived)
   */
  async fetchPublicProducts() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            display_order,
            is_primary
          )
        `)
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[Supabase] fetchPublicProducts failed:', error);
        throw new Error(`Failed to load catalog from Supabase: ${error.message}`);
      }

      // Map images
      return (data || []).map((p) => {
        const sortedImages = (p.product_images || [])
          .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order)
          .map((img) => img.image_url);

        return {
          ...p,
          price: Number(p.price),
          images: sortedImages.length > 0 ? sortedImages : (p.images || []),
        };
      });
    }

    // Local dev fallback
    const all = getLocalProducts();
    return all.filter((p) => p.status === 'published');
  },

  /**
   * Fetch all products for Admin (published, draft, sold out, archived)
   */
  async fetchAdminProducts() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            display_order,
            is_primary
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase] fetchAdminProducts failed:', error);
        throw new Error(`Failed to load admin products from Supabase: ${error.message}`);
      }

      return (data || []).map((p) => {
        const sortedImages = (p.product_images || [])
          .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order)
          .map((img) => img.image_url);

        return {
          ...p,
          price: Number(p.price),
          images: sortedImages.length > 0 ? sortedImages : (p.images || []),
        };
      });
    }

    // Local dev fallback
    return getLocalProducts();
  },

  /**
   * Fetch single product by slug (public)
   */
  async fetchProductBySlug(slug) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            display_order,
            is_primary
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) return null;

      const sortedImages = (data.product_images || [])
        .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order)
        .map((img) => img.image_url);

      return {
        ...data,
        price: Number(data.price),
        images: sortedImages.length > 0 ? sortedImages : (data.images || []),
      };
    }

    // Local dev fallback
    const all = getLocalProducts();
    return all.find((p) => p.slug === slug && p.status === 'published') || null;
  },

  /**
   * Fetch single product by ID (admin)
   */
  async fetchProductById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            display_order,
            is_primary
          )
        `)
        .eq('id', id)
        .single();

      if (error || !data) return null;

      const sortedImages = (data.product_images || [])
        .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order)
        .map((img) => img.image_url);

      return {
        ...data,
        price: Number(data.price),
        images: sortedImages.length > 0 ? sortedImages : (data.images || []),
      };
    }

    // Local dev fallback
    const all = getLocalProducts();
    return all.find((p) => p.id === id) || null;
  },

  /**
   * Save Product (Create or Update)
   */
  async saveProduct(productData) {
    const slug = productData.slug ? slugify(productData.slug) : slugify(productData.name);
    const cleanPayload = {
      name: productData.name,
      slug: slug,
      price: Number(productData.price),
      description: productData.description || '',
      category: productData.category || 'other',
      availability: productData.availability || 'Available',
      status: productData.status || 'draft',
      featured: Boolean(productData.featured),
      display_order: Number(productData.display_order) || 0,
      product_id: productData.product_id || '',
      fabric: productData.fabric || '',
      color: productData.color || '',
      included: productData.included || '',
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      care_instructions: productData.care_instructions || productData.careInstructions || '',
      shipping_information: productData.shipping_information || productData.shippingInformation || '',
      return_information: productData.return_information || productData.returnInformation || '',
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      let savedProduct;
      if (productData.id && !productData.id.startsWith('local-')) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update(cleanPayload)
          .eq('id', productData.id)
          .select()
          .single();

        if (error) throw new Error(`Failed to update product: ${error.message}`);
        savedProduct = data;
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('products')
          .insert({ ...cleanPayload, created_at: new Date().toISOString() })
          .select()
          .single();

        if (error) throw new Error(`Failed to create product: ${error.message}`);
        savedProduct = data;
      }

      // Sync images table
      if (productData.images && productData.images.length > 0) {
        // Delete previous images and re-insert with correct order
        await supabase.from('product_images').delete().eq('product_id', savedProduct.id);

        const imageInserts = productData.images.map((url, index) => ({
          product_id: savedProduct.id,
          image_url: url,
          display_order: index,
          is_primary: index === 0,
          created_at: new Date().toISOString(),
        }));

        const { error: imgError } = await supabase.from('product_images').insert(imageInserts);
        if (imgError) console.error('[Supabase] Failed to sync product images:', imgError);
      }

      return {
        ...savedProduct,
        images: productData.images || [],
      };
    }

    // Local dev fallback
    const all = getLocalProducts();
    let saved;
    if (productData.id) {
      saved = {
        ...productData,
        ...cleanPayload,
        images: productData.images || [],
      };
      const updated = all.map((p) => (p.id === productData.id ? saved : p));
      saveLocalProducts(updated);
    } else {
      saved = {
        ...cleanPayload,
        id: `local-${Date.now()}`,
        images: productData.images || [],
        created_at: new Date().toISOString(),
      };
      saveLocalProducts([saved, ...all]);
    }
    return saved;
  },

  /**
   * Archive a product (Soft Delete per PRD Addendum)
   */
  async archiveProduct(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw new Error(`Failed to archive product: ${error.message}`);
      return true;
    }

    // Local dev fallback
    const all = getLocalProducts();
    const updated = all.map((p) => (p.id === id ? { ...p, status: 'archived' } : p));
    saveLocalProducts(updated);
    return true;
  },

  /**
   * Restore an archived product
   */
  async restoreProduct(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({ status: 'draft', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw new Error(`Failed to restore product: ${error.message}`);
      return true;
    }

    // Local dev fallback
    const all = getLocalProducts();
    const updated = all.map((p) => (p.id === id ? { ...p, status: 'draft' } : p));
    saveLocalProducts(updated);
    return true;
  },

  /**
   * Permanent Delete (Destructive action only available in Archived view)
   */
  async permanentDeleteProduct(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(`Failed to permanently delete product: ${error.message}`);
      return true;
    }

    // Local dev fallback
    const all = getLocalProducts();
    const filtered = all.filter((p) => p.id !== id);
    saveLocalProducts(filtered);
    return true;
  },

  /**
   * Duplicate a product (clones into Draft)
   */
  async duplicateProduct(id) {
    const original = await this.fetchProductById(id);
    if (!original) throw new Error('Product to duplicate was not found.');

    const duplicatePayload = {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      slug: slugify(`${original.name}-copy-${Date.now().toString().slice(-4)}`),
      status: 'draft',
      featured: false,
    };

    return await this.saveProduct(duplicatePayload);
  },

  /**
   * Fetch Brand Settings
   */
  async fetchSettings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('settings').select('*').limit(1).single();
      if (error || !data) {
        return initialSeedSettings;
      }
      return {
        brandName: data.brand_name,
        logoUrl: data.logo_url,
        whatsappNumber: data.whatsapp_number,
        defaultWhatsappMessage: data.default_whatsapp_message,
        instagramHandle: data.instagram_handle,
        instagramUrl: data.instagram_url,
        email: data.email,
        businessHours: data.business_hours,
        location: data.location,
        shippingPolicy: data.shipping_policy,
        returnPolicy: data.return_policy,
      };
    }

    // Local dev fallback
    return getLocalSettings();
  },

  /**
   * Update Brand Settings
   */
  async updateSettings(settingsData) {
    if (isSupabaseConfigured) {
      const payload = {
        brand_name: settingsData.brandName,
        whatsapp_number: settingsData.whatsappNumber,
        default_whatsapp_message: settingsData.defaultWhatsappMessage,
        instagram_handle: settingsData.instagramHandle,
        instagram_url: settingsData.instagramUrl,
        email: settingsData.email,
        business_hours: settingsData.businessHours,
        location: settingsData.location,
        shipping_policy: settingsData.shippingPolicy,
        return_policy: settingsData.returnPolicy,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('settings')
        .update(payload)
        .neq('id', '00000000-0000-0000-0000-000000000000') // matches row
        .select()
        .single();

      if (error) throw new Error(`Failed to update settings: ${error.message}`);
      return settingsData;
    }

    // Local dev fallback
    saveLocalSettings(settingsData);
    return settingsData;
  },

  /**
   * Upload Product Image (with client compression & Supabase Storage)
   */
  async uploadProductImage(file) {
    const compressedBlob = await compressImage(file, 1400, 0.85);

    if (isSupabaseConfigured) {
      const fileExt = 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('catalog-images')
        .upload(filePath, compressedBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      const { data } = supabase.storage.from('catalog-images').getPublicUrl(filePath);
      return data.publicUrl;
    }

    // Local dev prototype: store as local Data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(compressedBlob);
    });
  },

  /**
   * Export complete catalog and settings JSON backup
   */
  async exportCatalogBackup() {
    const products = await this.fetchAdminProducts();
    const settings = await this.fetchSettings();

    const backup = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      brand: settings.brandName,
      settings,
      products,
    };

    return JSON.stringify(backup, null, 2);
  },

  /**
   * Validate & Import catalog backup
   */
  async validateAndImportBackup(jsonString) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      throw new Error('Invalid JSON file format.');
    }

    if (!parsed || !Array.isArray(parsed.products)) {
      throw new Error('Backup must contain a valid "products" array.');
    }

    // Import products
    for (const p of parsed.products) {
      if (!p.name || p.price === undefined) {
        throw new Error(`Product "${p.name || 'Unnamed'}" is missing required name or price.`);
      }
      await this.saveProduct(p);
    }

    // Import settings if present
    if (parsed.settings) {
      await this.updateSettings(parsed.settings);
    }

    return {
      productCount: parsed.products.length,
      settingsUpdated: Boolean(parsed.settings),
    };
  },
};
