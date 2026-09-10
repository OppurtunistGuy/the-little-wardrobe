import React, { useState } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle, 
  Mail, 
  Clock, 
  FileText,
  ShieldAlert,
  X
} from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import AdminLayout from './AdminLayout';
import { useCatalog } from '../context/CatalogContext';

export default function AdminSettings() {
  const { 
    settings, 
    updateSettings, 
    exportCatalogBackup, 
    validateAndImportBackup 
  } = useCatalog();

  const [formData, setFormData] = useState({
    brandName: settings.brandName || 'The Little Wardrobe',
    whatsappNumber: settings.whatsappNumber || '919876543210',
    defaultWhatsappMessage: settings.defaultWhatsappMessage || '',
    instagramHandle: settings.instagramHandle || '@thelittlewardrobe.in',
    instagramUrl: settings.instagramUrl || 'https://instagram.com',
    email: settings.email || 'care@thelittlewardrobe.in',
    businessHours: settings.businessHours || 'Mon – Sat: 10:00 AM – 7:00 PM IST',
    location: settings.location || 'New Delhi & Jaipur, India',
    shippingPolicy: settings.shippingPolicy || '',
    returnPolicy: settings.returnPolicy || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Backup & Restore State
  const [importFileContent, setImportFileContent] = useState(null);
  const [importParsedInfo, setImportParsedInfo] = useState(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState(null);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);
    setIsSaving(true);
    try {
      await updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export Catalog Backup Handler
  const handleExportBackup = async () => {
    try {
      const json = await exportCatalogBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tlw-catalog-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Failed to export backup: ${err.message}`);
    }
  };

  // File selection for import
  const handleFileSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setError(null);
    setImportSuccessMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = JSON.parse(text);
        if (!parsed || !Array.isArray(parsed.products)) {
          throw new Error('File does not have a valid "products" array.');
        }
        setImportFileContent(text);
        setImportParsedInfo({
          productCount: parsed.products.length,
          hasSettings: Boolean(parsed.settings),
          exportedAt: parsed.exportedAt || 'Unknown',
        });
      } catch (err) {
        setError(`Backup validation failed: ${err.message}`);
        setImportFileContent(null);
        setImportParsedInfo(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Confirm and Execute Import
  const handleExecuteImport = async () => {
    if (!importFileContent) return;
    setError(null);
    setIsSaving(true);
    try {
      const res = await validateAndImportBackup(importFileContent);
      setImportSuccessMessage(`Successfully restored ${res.productCount} products and settings!`);
      setImportFileContent(null);
      setImportParsedInfo(null);
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Business Settings &amp; Backup">
      {savedSuccess && (
        <div
          style={{
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            padding: '0.85rem 1.25rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            border: '1px solid #BBF7D0',
          }}
        >
          <CheckCircle size={18} />
          <span>Settings saved successfully. Public website and WhatsApp links updated.</span>
        </div>
      )}

      {importSuccessMessage && (
        <div
          style={{
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            padding: '0.85rem 1.25rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            border: '1px solid #BBF7D0',
          }}
        >
          <CheckCircle size={18} />
          <span>{importSuccessMessage}</span>
        </div>
      )}

      {error && (
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
            fontSize: '0.9rem',
            border: '1px solid #FECACA',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="admin-form-grid">
        {/* Left Column: Form Settings */}
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* WhatsApp Configuration (PRD Section 17) */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <MessageCircle size={20} color="var(--admin-success)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                WhatsApp Configuration
              </h3>
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="whatsapp-num">
                WhatsApp Business Number *
              </label>
              <input
                id="whatsapp-num"
                type="text"
                className="admin-input"
                placeholder="919876543210 (country code + number, no spaces)"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                Changing this number automatically updates every WhatsApp enquiry button and link across the website.
              </span>
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="whatsapp-msg">
                Default General Enquiry Template
              </label>
              <textarea
                id="whatsapp-msg"
                className="admin-textarea"
                rows="2"
                value={formData.defaultWhatsappMessage}
                onChange={(e) => setFormData({ ...formData, defaultWhatsappMessage: e.target.value })}
              />
            </div>
          </div>

          {/* Social & Business Profile (PRD Sections 18, 19) */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <InstagramIcon size={20} color="var(--admin-accent)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                Brand &amp; Social Profile
              </h3>
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="brand-name">Brand Name</label>
              <input
                id="brand-name"
                type="text"
                className="admin-input"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-field-group">
                <label className="admin-label" htmlFor="insta-handle">Instagram Handle</label>
                <input
                  id="insta-handle"
                  type="text"
                  className="admin-input"
                  placeholder="@thelittlewardrobe.in"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-label" htmlFor="insta-url">Instagram URL</label>
                <input
                  id="insta-url"
                  type="url"
                  className="admin-input"
                  placeholder="https://instagram.com/thelittlewardrobe"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-field-group">
                <label className="admin-label" htmlFor="brand-email">Contact Email</label>
                <input
                  id="brand-email"
                  type="email"
                  className="admin-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-label" htmlFor="brand-hours">Studio Hours</label>
                <input
                  id="brand-hours"
                  type="text"
                  className="admin-input"
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="brand-loc">Studio Location</label>
              <input
                id="brand-loc"
                type="text"
                className="admin-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Policies Box */}
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
              Policies &amp; Customer Notes
            </h3>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="policy-shipping">Shipping Policy</label>
              <textarea
                id="policy-shipping"
                className="admin-textarea"
                rows="2"
                value={formData.shippingPolicy}
                onChange={(e) => setFormData({ ...formData, shippingPolicy: e.target.value })}
              />
            </div>

            <div className="admin-field-group">
              <label className="admin-label" htmlFor="policy-return">Return / Exchange Policy</label>
              <textarea
                id="policy-return"
                className="admin-textarea"
                rows="2"
                value={formData.returnPolicy}
                onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ padding: '0.85rem', width: 'fit-content' }}
            disabled={isSaving}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </form>

        {/* Right Column: Catalog Backup & Safe Restore (PRD Section 38 & User Correction 4) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-card-box" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
              Catalog Backup &amp; Restore
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
              Export a complete snapshot of your products and settings as a JSON file, or restore your catalog from a previously verified backup.
            </p>

            {/* Export Action */}
            <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--admin-border)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                Export Catalog JSON
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                Downloads all silhouettes, descriptions, prices, categories, and settings.
              </p>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={handleExportBackup}
                style={{ width: '100%' }}
              >
                <Download size={16} />
                <span>Download Backup JSON</span>
              </button>
            </div>

            {/* Import Action */}
            <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--admin-border)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                Import Catalog JSON
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                Select a valid backup JSON file. You will be prompted with a preview to confirm before changes are applied.
              </p>

              <input
                type="file"
                id="backup-file-input"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleFileSelected}
              />
              <label
                htmlFor="backup-file-input"
                className="admin-btn admin-btn-secondary"
                style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}
              >
                <Upload size={16} />
                <span>Select Backup File...</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Import Confirmation Modal (User Correction 4: Safe Import with Preview) */}
      {importParsedInfo && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} color="var(--admin-warning)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                  Confirm Catalog Restore
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImportFileContent(null);
                  setImportParsedInfo(null);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p style={{ fontSize: '0.92rem', color: 'var(--admin-text-sub)', marginBottom: '1rem', lineHeight: 1.6 }}>
                The backup file was successfully validated. Review the details below before applying:
              </p>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--admin-border)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div><strong>Products to restore:</strong> {importParsedInfo.productCount}</div>
                <div><strong>Contains Settings:</strong> {importParsedInfo.hasSettings ? 'Yes' : 'No'}</div>
                <div><strong>Exported on:</strong> {importParsedInfo.exportedAt}</div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '1rem', lineHeight: 1.5 }}>
                ⚠️ Notice: Applying this backup will update products and settings in your catalog database.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  setImportFileContent(null);
                  setImportParsedInfo(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleExecuteImport}
                disabled={isSaving}
              >
                {isSaving ? 'Restoring...' : 'Confirm & Apply Backup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
