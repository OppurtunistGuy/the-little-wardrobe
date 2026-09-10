import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { MessageCircle, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useCatalog } from '../context/CatalogContext';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import '../styles/header.css';

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [location] = useLocation();
  const { settings } = useCatalog();

  // Close drawer upon navigation
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/collection' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>Handcrafted Slow Fashion</span>
        <span className="announcement-dot" aria-hidden="true"></span>
        <span>Free pan-India shipping over ₹2,999</span>
        <span className="announcement-dot" aria-hidden="true"></span>
        <span>Direct WhatsApp support</span>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="container header-inner">
          {/* Logo */}
          <Link href="/" className="brand-logo-link">
            <span className="brand-logo-text">{settings.brandName}</span>
            <span className="brand-logo-sub">Studio &amp; Catalog</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {navLinks.map(link => {
              const isActive = location === link.path || (link.path !== '/' && location.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Instagram Link */}
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="header-icon-btn"
              title="Visit our Instagram"
              aria-label="Instagram"
            >
              <InstagramIcon size={20} />
            </a>

            {/* WhatsApp Direct Action */}
            <a
              href={getGeneralWhatsAppUrl(null, settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="header-whatsapp-pill"
              title="Chat with us on WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-Over Drawer */}
      <aside
        className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-header">
          <div>
            <div className="brand-logo-text" style={{ fontSize: '1.25rem' }}>{settings.brandName}</div>
            <div className="brand-logo-sub">Everyday Silhouettes</div>
          </div>
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="drawer-nav">
          {navLinks.map(link => {
            const isActive = location === link.path || (link.path !== '/' && location.startsWith(link.path));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`drawer-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsDrawerOpen(false)}
              >
                <span>{link.label}</span>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </Link>
            );
          })}
        </nav>

        <div className="drawer-footer">
          <a
            href={getGeneralWhatsAppUrl(null, settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ width: '100%' }}
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="drawer-social-link"
          >
            <InstagramIcon size={18} color="var(--color-primary)" />
            <span>Follow on Instagram ({settings.instagramHandle})</span>
          </a>
        </div>
      </aside>
    </>
  );
}
