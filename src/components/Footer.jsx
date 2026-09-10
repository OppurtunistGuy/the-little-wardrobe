import React from 'react';
import { Link } from 'wouter';
import { MessageCircle, Heart, ArrowUpRight } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useCatalog } from '../context/CatalogContext';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import '../styles/footer.css';

export default function Footer() {
  const { settings } = useCatalog();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div>
            <div className="footer-brand-title">{settings.brandName}</div>
            <p className="footer-brand-desc">
              {settings.subTagline} Designed for relaxed ease, hand-finished in small conscious batches.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="header-icon-btn"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={getGeneralWhatsAppUrl(null, settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="header-icon-btn"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="footer-heading">Navigate</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/collection">Complete Collection</Link></li>
              <li><Link href="/about">About Our Studio</Link></li>
              <li><Link href="/contact">Contact &amp; Care</Link></li>
            </ul>
          </div>

          {/* Quick Enquiries */}
          <div>
            <h4 className="footer-heading">Direct Ordering</h4>
            <div className="footer-contact-item">
              <MessageCircle size={16} color="var(--color-whatsapp-dark)" />
              <a
                href={getGeneralWhatsAppUrl(null, settings)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}
              >
                WhatsApp: {settings.whatsappDisplayNumber || settings.whatsappNumber}
              </a>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Available {settings.businessHours}
            </p>
            <a
              href={getGeneralWhatsAppUrl(null, settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.84rem', padding: '0.5rem 1rem', width: '100%' }}
            >
              <span>Message on WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {currentYear} {settings.brandName || 'The Little Wardrobe'}. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <span>Design &amp; Built by Thinkable &amp; Co — Vikas Patil</span>
            <Heart size={13} fill="var(--color-secondary)" color="var(--color-secondary)" />
          </div>
        </div>
      </div>
    </footer>
  );
}
