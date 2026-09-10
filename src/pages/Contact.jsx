import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import { useCatalog } from '../context/CatalogContext';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import '../styles/contact.css';

export default function Contact() {
  const { settings } = useCatalog();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    // Create dynamic pre-filled WhatsApp message from user's input
    const customMessage = `Hi! My name is ${formData.name}${formData.email ? ` (${formData.email})` : ''}. ${formData.message}`;
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <span className="section-subtitle">We Are Here For You</span>
          <h1 className="section-title">Get In Touch</h1>
          <p className="section-desc" style={{ maxWidth: '580px', margin: '0 auto' }}>
            Whether you need custom sleeve adjustments, advice on fabric weights, or help with an order — message us anytime.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="contact-layout">
          {/* Direct Contact Methods */}
          <div className="contact-methods">
            {/* Primary WhatsApp Card (PRD Section 14) */}
            <div className="contact-card-primary">
              <span className="contact-badge-primary">
                <MessageCircle size={15} />
                <span>Fastest Response Channel</span>
              </span>
              <h3 className="contact-card-title">Chat with us on WhatsApp</h3>
              <p className="contact-card-desc">
                Our founders and styling team handle all WhatsApp conversations directly. Typical response time is under 30 minutes during studio hours.
              </p>
              <a
                href={getGeneralWhatsAppUrl(null, settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ alignSelf: 'flex-start', padding: '0.85rem 1.5rem' }}
              >
                <MessageCircle size={20} />
                <span>Open WhatsApp ({settings.whatsappDisplayNumber || settings.whatsappNumber})</span>
              </a>
            </div>

            {/* Other Channels Box */}
            <div className="contact-channels-box">
              <div className="channel-row">
                <div className="channel-icon-circle">
                  <InstagramIcon size={20} />
                </div>
                <div className="channel-info">
                  <h4>Instagram Direct Messages</h4>
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                    {settings.instagramHandle}
                  </a>
                </div>
              </div>

              <div className="channel-row">
                <div className="channel-icon-circle">
                  <Mail size={20} />
                </div>
                <div className="channel-info">
                  <h4>Email Enquiries</h4>
                  <a href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="channel-row">
                <div className="channel-icon-circle">
                  <Clock size={20} />
                </div>
                <div className="channel-info">
                  <h4>Studio Hours</h4>
                  <p>{settings.businessHours}</p>
                </div>
              </div>

              <div className="channel-row">
                <div className="channel-icon-circle">
                  <MapPin size={20} />
                </div>
                <div className="channel-info">
                  <h4>Location</h4>
                  <p>{settings.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Functional Contact / Message Form */}
          <div className="contact-form-box">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                <h3 className="contact-form-title">Thank You, {formData.name}!</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Your enquiry has been formatted and transferred to WhatsApp. If the WhatsApp window did not open automatically, you can tap below to continue our chat.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                      `Hi! My name is ${formData.name}. ${formData.message}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <MessageCircle size={18} />
                    <span>Continue on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="contact-form-title">Send a Quick Note</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Type your message below and we will automatically direct it to our WhatsApp care desk.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ananya Sharma"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">Email Address (Optional)</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">Your Message / Query *</label>
                    <textarea
                      id="contact-message"
                      className="form-textarea"
                      placeholder="Ask us about sizing, custom lengths, availability, or dispatch timelines..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    <Send size={18} />
                    <span>Send to WhatsApp Care Desk</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
