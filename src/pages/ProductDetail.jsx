import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { 
  MessageCircle, 
  ChevronRight, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import ProductGallery from '../components/ProductGallery';
import SizeSelector from '../components/SizeSelector';
import Accordion from '../components/Accordion';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

export default function ProductDetail() {
  const [, params] = useRoute('/products/:slug');
  const slug = params?.slug;
  const { publicProducts, settings, loading } = useCatalog();
  const product = publicProducts.find((p) => p.slug === slug);

  // Conditional size selection state: if sizes exist, default to first available size
  const [selectedSize, setSelectedSize] = useState(
    product && product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );

  const [copied, setCopied] = useState(false);

  // Update selected size if product changes
  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize(null);
    }
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem var(--container-px)', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>Silhouette Not Found</h1>
        <p style={{ marginBottom: '2rem' }}>The piece you are looking for may have retired or the link might be incomplete.</p>
        <Link href="/collection" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Collection</span>
        </Link>
      </div>
    );
  }

  const isSoldOut = product.availability === 'Sold Out';
  const priceFormatted = `₹${Number(product.price).toLocaleString('en-IN')}`;
  const whatsappUrl = getProductWhatsAppUrl(product, selectedSize, settings);

  // Share link handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} — ${settings.brandName}`,
          text: `Check out ${product.name} on ${settings.brandName}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Build accordion items only if actual information exists (PRD Section 26: Missing Data rule)
  const care = product.care_instructions || product.careInstructions;
  const shipping = product.shipping_information || product.shippingInformation;
  const returns = product.return_information || product.returnInformation;

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
              <span className="attribute-term">Set Includes:</span>
              <span>{product.included}</span>
            </>
          )}
        </div>
      ),
    },
    care && {
      title: 'Care & Wash Guide',
      content: care,
    },
    shipping && {
      title: 'Shipping & Delivery',
      content: shipping,
    },
    returns && {
      title: 'Exchanges & Size Help',
      content: returns,
    },
  ].filter(Boolean);

  // Related products from public catalog in same category
  const relatedList = publicProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <div className="product-detail-page">
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        {/* Breadcrumbs */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/collection">Collection</Link>
          <ChevronRight size={14} />
          <Link href={`/collection?category=${product.category}`} style={{ textTransform: 'capitalize' }}>
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{product.name}</span>
        </nav>

        {/* Product Layout: Gallery (Left) + Details (Right) */}
        <div className="product-detail-layout">
          {/* Left Column: Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="product-info-wrap">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="product-category-tag">{product.category}</span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="header-icon-btn"
                  title="Share this silhouette"
                  aria-label="Share silhouette"
                  style={{ width: '36px', height: '36px' }}
                >
                  {copied ? <Check size={16} color="var(--color-primary)" /> : <Share2 size={16} />}
                </button>
              </div>

              <h1 className="product-detail-title">{product.name}</h1>
            </div>

            {/* Price & Availability */}
            <div className="product-detail-price-box">
              <span className="product-detail-price">{priceFormatted}</span>
              {isSoldOut ? (
                <span className="badge badge-sold">Sold Out</span>
              ) : (
                <span className="badge badge-sage">In Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="product-detail-description">
              {product.description}
            </p>

            {/* Conditional Size Selector (PRD Section 11) */}
            {product.sizes && product.sizes.length > 0 && !isSoldOut && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            )}

            {/* Primary Conversion CTA: WhatsApp (PRD Section 12) */}
            <div className="product-cta-section">
              {isSoldOut ? (
                <a
                  href={getProductWhatsAppUrl(product, null)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-action-btn"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <MessageCircle size={20} />
                  <span>Notify Me on Restock via WhatsApp</span>
                </a>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-action-btn"
                  id="whatsapp-enquire-btn"
                >
                  <MessageCircle size={22} />
                  <span>Enquire on WhatsApp</span>
                </a>
              )}

              <p className="whatsapp-hint">
                <ShieldCheck size={14} color="var(--color-primary)" />
                <span>Opens directly with a pre-filled enquiry for {product.name}</span>
              </p>
            </div>

            {/* Accordions: Fabric, Care, Shipping, Returns */}
            <Accordion items={accordionItems} />
          </div>
        </div>

        {/* Related Silhouettes */}
        {relatedList.length > 0 && (
          <section className="section" style={{ borderTop: '1px solid var(--color-border)', marginTop: '2rem' }}>
            <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <span className="section-subtitle">Complete The Look</span>
              <h2 style={{ fontSize: '1.8rem' }}>You May Also Love</h2>
            </div>

            <div className="product-grid">
              {relatedList.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile WhatsApp CTA Bar (PRD Section 19: Easy WhatsApp access on mobile) */}
      <div className="mobile-sticky-cta-bar" aria-label="Quick WhatsApp Enquiry Bar">
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>
            {product.name}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
            {priceFormatted} {selectedSize ? `• ${selectedSize}` : ''}
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp"
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
        >
          <MessageCircle size={18} />
          <span>Enquire</span>
        </a>
      </div>
    </div>
  );
}
