import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Star, 
  Eye, 
  Save, 
  Check, 
  AlertCircle,
  MoveLeft,
  MoveRight,
  Plus
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useCatalog } from '../context/CatalogContext';
import ProductPreviewModal from './ProductPreviewModal';

export default function AdminProductEditor() {
  const [, newParams] = useRoute('/admin/products/new');
  const [, editParams] = useRoute('/admin/products/:id/edit');
  const [, setLocation] = useLocation();

  const productId = editParams?.id;
  const isEditing = Boolean(productId);

  const { adminProducts, saveProduct, uploadProductImage } = useCatalog();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    category: 'co-ords',
    description: '',
    availability: 'Available',
    status: 'draft',
    featured: false,
    sizes: ['S', 'M', 'L'],
    images: [],
    fabric: '',
    color: '',
    included: '',
    care_instructions: '',
    shipping_information: '',
    return_information: '',
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load existing product if editing
  useEffect(() => {
    if (isEditing && adminProducts.length > 0) {
      const found = adminProducts.find((p) => p.id === productId);
      if (found) {
        setFormData({
          id: found.id,
          name: found.name || '',
          slug: found.slug || '',
          price: found.price || '',
          category: found.category || 'other',
          description: found.description || '',
          availability: found.availability || 'Available',
          status: found.status || 'draft',
          featured: Boolean(found.featured),
          sizes: found.sizes || [],
          images: found.images || [],
          fabric: found.fabric || '',
          color: found.color || '',
          included: found.included || '',
          care_instructions: found.care_instructions || found.careInstructions || '',
          shipping_information: found.shipping_information || found.shippingInformation || '',
          return_information: found.return_information || found.returnInformation || '',
        });
      }
    }
  }, [isEditing, productId, adminProducts]);

  // Size toggle handler
  const handleToggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const nextSizes = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: nextSizes };
    });
  };

  // Image Upload handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    setValidationError(null);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadProductImage(file);
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      setValidationError(`Image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add Image via Direct URL
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  // Set Primary Image
  const handleSetPrimaryImage = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const newImages = [...prev.images];
      const [selected] = newImages.splice(index, 1);
      newImages.unshift(selected);
      return { ...prev, images: newImages };
    });
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Save handler (Draft or Published)
  const handleSave = async (targetStatus) => {
    setValidationError(null);

    // Validation (PRD Section 21)
    if (!formData.name.trim()) {
      setValidationError('Please enter a product name.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setValidationError('Please enter a valid price in INR.');
      return;
    }
    if (targetStatus === 'published') {
      if (!formData.description.trim()) {
        setValidationError('Please add a short product description before publishing.');
        return;
      }
      if (!formData.images || formData.images.length === 0) {
        setValidationError('Please add at least one product photo before publishing.');
        return;
      }
    }

    // Featured count check (PRD Section 34: Max 4)
    if (formData.featured) {
      const otherFeatured = adminProducts.filter((p) => p.featured && p.id !== formData.id).length;
      if (otherFeatured >= 4) {
        setValidationError('Maximum 4 products can be featured on Home. Please uncheck "Featured" or unfeature another product.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await saveProduct({
        ...formData,
        price: Number(formData.price),
        status: targetStatus,
      });
      setLocation('/admin/products');
    } catch (err) {
      setValidationError(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title={isEditing ? `Edit Silhouette: ${formData.name || 'Product'}` : 'Add New Silhouette'}>
      {/* Top back navigation and buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <Link
          href="/admin/products"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-sub)', fontSize: '0.9rem', fontWeight: 500 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setShowPreview(true)}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
          >
            <Save size={16} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => handleSave('published')}
            disabled={isSubmitting}
          >
            <Check size={16} />
            <span>{isSubmitting ? 'Saving...' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Validation alert banner */}
      {validationError && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            padding: '0.85rem 1.25rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem',
            border: '1px solid #FECACA',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Editor Form Layout */}
      <div className="admin-form-grid">
        {/* Left Column: Basic Information & Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic Info Box */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
              Basic Information
            </h3>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="product-name">
                Product Name *
              </label>
              <input
                id="product-name"
                type="text"
                className="admin-input"
                placeholder="e.g. Floral Linen Co-ord Set"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-field-group">
                <label className="admin-label" htmlFor="product-price">
                  Price (₹ INR) *
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="1"
                  className="admin-input"
                  placeholder="1499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-label" htmlFor="product-category">
                  Category *
                </label>
                <select
                  id="product-category"
                  className="admin-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="co-ords">Co-ords</option>
                  <option value="dresses">Dresses</option>
                  <option value="tops">Tops</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="product-desc">
                Product Description *
              </label>
              <textarea
                id="product-desc"
                className="admin-textarea"
                rows="4"
                placeholder="Describe the fit, silhouette, and feel..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Product Image Manager Box (PRD Section 7 & 35) */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
              Product Photography
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)', margin: '0 0 1.25rem' }}>
              The first image is the <strong>Primary Image</strong> shown on cards and in the featured section.
            </p>

            {/* Upload Area */}
            <div
              style={{
                border: '2px dashed var(--admin-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
                marginBottom: '1rem',
              }}
            >
              <input
                type="file"
                id="photo-upload-input"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploadingImage}
              />
              <label
                htmlFor="photo-upload-input"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'var(--admin-accent)',
                }}
              >
                <Upload size={18} />
                <span>{uploadingImage ? 'Optimizing & Uploading...' : 'Upload Photos from Computer'}</span>
              </label>
              <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                Images are automatically compressed to ensure fast mobile page loads.
              </div>
            </div>

            {/* Add via URL */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="url"
                className="admin-input"
                placeholder="Or paste an image web URL..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={handleAddImageUrl}
              >
                <Plus size={16} />
                <span>Add URL</span>
              </button>
            </div>

            {/* Image Thumbnails Grid */}
            {formData.images.length > 0 ? (
              <div className="image-manager-grid">
                {formData.images.map((url, idx) => (
                  <div key={idx} className={`image-thumb-card ${idx === 0 ? 'is-primary' : ''}`}>
                    <img src={url} alt={`Upload ${idx + 1}`} />

                    <div className="image-thumb-actions">
                      {idx !== 0 && (
                        <button
                          type="button"
                          className="image-action-btn"
                          title="Set as primary"
                          onClick={() => handleSetPrimaryImage(idx)}
                        >
                          <Star size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="image-action-btn"
                        title="Remove photo"
                        onClick={() => handleRemoveImage(idx)}
                        style={{ backgroundColor: 'rgba(220, 38, 38, 0.85)' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {idx === 0 && <span className="image-primary-badge">Primary</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                No images added yet. Add at least one image before publishing.
              </div>
            )}
          </div>

          {/* Sizing Options */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
              Available Sizes
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)', margin: '0 0 1rem' }}>
              Uncheck all if this piece is free-size or non-sized.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['XS', 'S', 'M', 'L', 'XL', 'Free Size'].map((size) => {
                const isSelected = formData.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSize(size)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: isSelected ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                      backgroundColor: isSelected ? 'var(--admin-primary)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--admin-text-main)',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Status, Visibility & Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status & Availability Box */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
              Status &amp; Visibility
            </h3>

            {/* Availability */}
            <div className="admin-field-group">
              <label className="admin-label">Stock Availability</label>
              <select
                className="admin-select"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <option value="Available">Available (In Stock)</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>

            {/* Status (Draft vs Published) */}
            <div className="admin-field-group">
              <label className="admin-label">Publication Status</label>
              <select
                className="admin-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="published">Published (Visible on site)</option>
                <option value="draft">Draft (Private in admin)</option>
              </select>
            </div>

            {/* Featured toggle */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--admin-border)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', marginTop: '2px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Feature on Home Page</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>
                    Display in the top 4 signature silhouettes on the home page.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Detailed Attributes Box (Fabric, Included, Care, Shipping) */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
              Fabric &amp; Care Details
            </h3>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="attr-fabric">Fabric Material</label>
              <input
                id="attr-fabric"
                type="text"
                className="admin-input"
                placeholder="e.g. 100% Pure European Linen"
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
              />
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="attr-color">Color / Shade</label>
              <input
                id="attr-color"
                type="text"
                className="admin-input"
                placeholder="e.g. Muted Herb Sage"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="attr-included">What's Included</label>
              <input
                id="attr-included"
                type="text"
                className="admin-input"
                placeholder="e.g. Button-down blouse & culotte trousers"
                value={formData.included}
                onChange={(e) => setFormData({ ...formData, included: e.target.value })}
              />
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="attr-care">Care Instructions</label>
              <textarea
                id="attr-care"
                className="admin-textarea"
                rows="2"
                placeholder="e.g. Gentle cold wash. Air dry in shade."
                value={formData.care_instructions}
                onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
              />
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="attr-shipping">Shipping &amp; Delivery</label>
              <textarea
                id="attr-shipping"
                className="admin-textarea"
                rows="2"
                placeholder="e.g. Dispatched within 24-48 hours. Express pan-India delivery."
                value={formData.shipping_information}
                onChange={(e) => setFormData({ ...formData, shipping_information: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <ProductPreviewModal
          product={{
            ...formData,
            price: Number(formData.price) || 0,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </AdminLayout>
  );
}
