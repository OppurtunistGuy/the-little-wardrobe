import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck } from 'lucide-react';
import ProductGallery from '../components/ProductGallery';
import SizeSelector from '../components/SizeSelector';
import Accordion from '../components/Accordion';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { brandConfig } from '../config/brandConfig';

export default function ProductPreviewModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );

  const priceFormatted = `${brandConfig.currencySymbol || '₹'}${Number(product.price).toLocaleString('en-IN')}`;
  const whatsappUrl = getProductWhatsAppUrl(product, selectedSize);

  const accordionItems = [
    {
      title: 'Fabric & Silhouette Details',
      customContent: (
        <div className="attribute-list">
          {product.fabric && (
            <>
              <span className="attribute-term">Fabric:</span>
              <span>{product.fabric}</span>
            </>
          )}
          {product.color && (
            <>
              <span className="attribute-term">Color / Tone:</span>
              <span>{product.color}</span>
            </>
          )}
          {product.included && (
            <>
              <span className="attribute-term">Includes:</span>
              <span>{product.included}</span>
            </>
          )}
        </div>
      ),
    },
    product.care_instructions && {
      title: 'Care & Wash Guide',
      content: product.care_instructions,
    },
    product.shipping_information && {
      title: 'Shipping & Delivery',
      content: product.shipping_information,
    },
  ].filter(Boolean);

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: '820px', width: '95%' }}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              className={`admin-pill ${product.status}`}
              style={{ fontSize: '0.72rem' }}
            >
              {product.status}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--admin-text-sub)' }}>
              Customer Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal-body" style={{ padding: '1.75rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Gallery */}
            <div>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Product Meta & CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span className="product-category-tag">{product.category}</span>
                <h2 style={{ fontSize: '1.65rem', margin: '0.25rem 0' }}>{product.name}</h2>
                <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {priceFormatted}
                </div>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {product.description}
              </p>

              {product.sizes && product.sizes.length > 0 && (
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                />
              )}

              {/* Dynamic WhatsApp Button Preview */}
              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-action-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <MessageCircle size={20} />
                  <span>Enquire on WhatsApp</span>
                </a>
                <p className="whatsapp-hint" style={{ marginTop: '0.5rem' }}>
                  <ShieldCheck size={14} />
                  <span>Generates: &ldquo;Hi! I'm interested in {product.name} priced at {priceFormatted}{selectedSize ? ` in size ${selectedSize}` : ''}...&rdquo;</span>
                </p>
              </div>

              <Accordion items={accordionItems} />
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
