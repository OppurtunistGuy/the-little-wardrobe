import React from 'react';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Scissors 
} from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import { useCatalog } from '../context/CatalogContext';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

export default function Home() {
  const { featuredProducts, settings, loading } = useCatalog();

  const instagramPosts = [
    {
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      caption: "Floral Linen Co-ord in morning light"
    },
    {
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
      caption: "Sage Midi Dress on a quiet weekend"
    },
    {
      img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
      caption: "Tiered Cotton silhouettes"
    },
    {
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
      caption: "Earth tone co-ords crafted in pure linen"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Hero Left Content */}
            <div className="hero-content">
              <span className="hero-eyebrow">
                <Sparkles size={14} />
                <span>Handcrafted Studio Edition</span>
              </span>
              
              <h1 className="hero-title">
                Thoughtfully crafted <em>everyday silhouettes</em> for the gentle soul.
              </h1>
              
              <p className="hero-description">
                Mindfully made linen co-ords, breathable dresses, and breezy separates. Browse our curated catalog directly from Instagram and order seamlessly through WhatsApp.
              </p>

              <div className="hero-actions">
                <Link href="/collection" className="btn btn-primary">
                  <span>Explore Collection</span>
                  <ArrowRight size={18} />
                </Link>

                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="hero-visual">
              <div className="hero-image-frame">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
                  alt="The Little Wardrobe Collection Editorial"
                  className="hero-image"
                  loading="eager"
                />
              </div>

              <div className="hero-floating-card">
                <span className="hero-floating-tag">Slow Fashion</span>
                <p className="hero-floating-text">
                  Hand-finished in small batches. Gentle on the skin, kind to nature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Craftsmanship Strip */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-wrap">
                <Scissors size={20} />
              </div>
              <h4 className="feature-title">Conscious Batches</h4>
              <p className="feature-desc">Small-run collections created to prevent textile overproduction.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrap">
                <Sparkles size={20} />
              </div>
              <h4 className="feature-title">Natural Breathable Fibers</h4>
              <p className="feature-desc">100% pure European linens, khadi, and organic slub cottons.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrap">
                <MessageCircle size={20} />
              </div>
              <h4 className="feature-title">Personal Attention</h4>
              <p className="feature-desc">Speak directly with our team on WhatsApp for size advice.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrap">
                <Truck size={20} />
              </div>
              <h4 className="feature-title">Pan-India Delivery</h4>
              <p className="feature-desc">Express doorstep shipping with easy 7-day size exchange.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (PRD Section 7.1: Max 4 products) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Curated Bestsellers</span>
            <h2 className="section-title">Signature Pieces</h2>
            <p className="section-desc">
              Beloved staples worn on repeat. Tap any piece to explore detailed measurements and enquire immediately.
            </p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/collection" className="btn btn-secondary">
              <span>View All 12 Silhouettes</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Snapshot (PRD Section 7.1) */}
      <section className="container">
        <div className="brand-snapshot-section">
          <div className="brand-snapshot-inner">
            <span className="section-subtitle">Our Philosophy</span>
            <blockquote className="brand-snapshot-quote">
              &ldquo;We design for days that move at your own pace. Clothes that feel like a gentle exhale — timeless, uncomplicated, and deeply comfortable.&rdquo;
            </blockquote>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              The Little Wardrobe began from a desire to bring back heartfelt clothing. We make pieces you reach for instinctively, tailored from breathable natural textiles that age gracefully with you.
            </p>
            <Link href="/about" className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>
              <span>Read Our Story</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram / Social Community Showcase */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div className="social-preview-header">
            <span className="section-subtitle">As Seen On Feed</span>
            <h2 className="section-title">Follow The Journey</h2>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-handle-badge"
            >
              <InstagramIcon size={18} />
              <span>{settings.instagramHandle}</span>
            </a>
          </div>

          <div className="social-grid">
            {instagramPosts.map((post, idx) => (
              <a
                key={idx}
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-item"
                aria-label={post.caption}
              >
                <img
                  src={post.img}
                  alt={post.caption}
                  className="social-img"
                  loading="lazy"
                />
                <div className="social-overlay">
                  <InstagramIcon size={24} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Direct WhatsApp Banner */}
      <section className="container">
        <div className="whatsapp-banner">
          <h2>Have a question about fit, fabric, or sizing?</h2>
          <p>
            We are just a quick message away. Text us on WhatsApp for personal recommendations, styling tips, or custom length requests.
          </p>
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ backgroundColor: '#25D366', color: '#0F5132' }}
          >
            <MessageCircle size={20} />
            <span>Chat on WhatsApp ({settings.whatsappDisplayNumber})</span>
          </a>
        </div>
      </section>
    </div>
  );
}
