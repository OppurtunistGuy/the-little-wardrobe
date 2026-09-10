import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, MessageCircle, Sparkles, Feather, Heart } from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import '../styles/about.css';

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <span className="section-subtitle">Our Studio &amp; Origins</span>
          <h1 className="about-title">Making space for slow, honest fashion.</h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--color-text-secondary)' }}>
            The Little Wardrobe is a small, conscious fashion label celebrating natural textiles, gentle hues, and relaxed everyday ease.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Story Section */}
        <div className="about-story-grid">
          <div className="about-story-img-frame">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
              alt="The Little Wardrobe atelier"
              className="about-story-img"
              loading="lazy"
            />
          </div>

          <div className="about-story-text">
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Born from a love for linen and light.</h2>
            <p>
              In a world of fleeting micro-trends and polyester overload, we wanted to build something quieter. A collection of garments that feel like breathing room — unhurried, comfortable, and made to be loved for seasons, not weeks.
            </p>
            <p>
              We source only natural, tactile fibers: pure European linens that soften beautifully with every wash, handwoven khadi cottons with organic character, and airy slub voiles that let your skin breathe in warm climates.
            </p>
            <p>
              Each piece is patterned in relaxed silhouettes that flatter gracefully without constricting. Because what you wear at home, in the garden, or out with friends should feel as gentle as a Sunday morning.
            </p>
          </div>
        </div>

        {/* Brand Values */}
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <span className="section-subtitle">Guiding Commitments</span>
          <h2 className="section-title">What We Stand For</h2>
        </div>

        <div className="about-values-grid">
          <div className="about-value-card">
            <div style={{ color: 'var(--color-primary-dark)' }}>
              <Feather size={28} />
            </div>
            <h3>100% Breathable Fibers</h3>
            <p>
              We say no to synthetic polyester blends. Every silhouette is cut from certified pure linen, mulmul, slub cotton, or modal that feels heavenly on sensitive skin.
            </p>
          </div>

          <div className="about-value-card">
            <div style={{ color: 'var(--color-primary-dark)' }}>
              <Sparkles size={28} />
            </div>
            <h3>Conscious Limited Batches</h3>
            <p>
              We do not mass produce. Pieces are crafted in limited batches to eliminate deadstock waste and ensure every stitch receives personal attention.
            </p>
          </div>

          <div className="about-value-card">
            <div style={{ color: 'var(--color-primary-dark)' }}>
              <Heart size={28} />
            </div>
            <h3>The Human Touch</h3>
            <p>
              When you message us on WhatsApp, you speak directly to our small founding team. We take personal pride in answering fit questions and tailoring sizing for you.
            </p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="whatsapp-banner" style={{ marginTop: '0', marginBottom: '5rem' }}>
          <h2>Ready to discover your next favorite piece?</h2>
          <p>
            Browse our complete catalog or say hello directly on WhatsApp. We would love to welcome you into our community.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/collection" className="btn btn-secondary" style={{ backgroundColor: '#FFFFFF', color: 'var(--color-text-primary)' }}>
              <span>Explore The Catalog</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ backgroundColor: '#25D366', color: '#0F5132' }}
            >
              <MessageCircle size={18} />
              <span>Say Hello on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
