import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Copy, 
  Eye, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Star, 
  AlertCircle,
  X
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useCatalog } from '../context/CatalogContext';
import { brandConfig } from '../config/brandConfig';
import ProductPreviewModal from './ProductPreviewModal';

export default function AdminProductList() {
  const { 
    adminProducts, 
    archiveProduct, 
    restoreProduct, 
    permanentDeleteProduct, 
    duplicateProduct,
    saveProduct,
    loading 
  } = useCatalog();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [confirmArchiveId, setConfirmArchiveId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Tabs count
  const counts = useMemo(() => {
    return {
      all: adminProducts.filter(p => p.status !== 'archived').length,
      published: adminProducts.filter(p => p.status === 'published').length,
      draft: adminProducts.filter(p => p.status === 'draft').length,
      soldOut: adminProducts.filter(p => p.availability === 'Sold Out' && p.status !== 'archived').length,
      archived: adminProducts.filter(p => p.status === 'archived').length,
    };
  }, [adminProducts]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return adminProducts.filter((p) => {
      // Tab filter
      if (activeTab === 'all' && p.status === 'archived') return false;
      if (activeTab === 'published' && p.status !== 'published') return false;
      if (activeTab === 'draft' && p.status !== 'draft') return false;
      if (activeTab === 'soldOut' && (p.availability !== 'Sold Out' || p.status === 'archived')) return false;
      if (activeTab === 'archived' && p.status !== 'archived') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [adminProducts, activeTab, searchQuery]);

  // Featured toggle handler (Enforces max 4 featured per PRD Section 34)
  const handleToggleFeatured = async (product) => {
    setActionError(null);
    const currentlyFeaturedCount = adminProducts.filter((p) => p.featured && p.id !== product.id).length;

    if (!product.featured && currentlyFeaturedCount >= 4) {
      setActionError('Maximum 4 products can be featured on the Home page. Please unfeature another item first.');
      return;
    }

    try {
      await saveProduct({
        ...product,
        featured: !product.featured,
      });
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDuplicate = async (id) => {
    setActionError(null);
    try {
      await duplicateProduct(id);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleArchive = async (id) => {
    setActionError(null);
    try {
      await archiveProduct(id);
      setConfirmArchiveId(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleRestore = async (id) => {
    setActionError(null);
    try {
      await restoreProduct(id);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handlePermanentDelete = async (id) => {
    setActionError(null);
    try {
      await permanentDeleteProduct(id);
      setConfirmDeleteId(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <AdminLayout title="Product Management">
      {/* Top Banner Alert if any error occurs */}
      {actionError && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            padding: '0.85rem 1.25rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #FECACA',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
            <AlertCircle size={18} />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header with Search and New Product button */}
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
        <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            className="admin-input"
            style={{ width: '100%', paddingLeft: '2.4rem' }}
            placeholder="Search by name, category, or fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={16}
            color="var(--admin-text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          <PlusCircle size={16} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--admin-border)',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'all', label: `All (${counts.all})` },
          { id: 'published', label: `Published (${counts.published})` },
          { id: 'draft', label: `Drafts (${counts.draft})` },
          { id: 'soldOut', label: `Sold Out (${counts.soldOut})` },
          { id: 'archived', label: `Archived (${counts.archived})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.88rem',
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--admin-text-main)' : 'var(--admin-text-sub)',
              borderBottom: activeTab === tab.id ? '2px solid var(--admin-primary)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product List Table / Box */}
      <div className="admin-card-box">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>No products found</h4>
            <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {searchQuery
                ? `No products matched "${searchQuery}".`
                : activeTab === 'archived'
                ? 'Your archive is empty.'
                : 'No products in this view.'}
            </p>
            {activeTab !== 'archived' && (
              <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
                <PlusCircle size={16} />
                <span>Create New Product</span>
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Featured</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Availability</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const primaryImage = p.images && p.images[0];
                  return (
                    <tr key={p.id}>
                      {/* Featured Star Toggle */}
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          title={p.featured ? 'Remove from Home page' : 'Feature on Home page (max 4)'}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: p.featured ? '#D97706' : '#CBD5E1',
                            display: 'flex',
                            padding: '4px',
                          }}
                        >
                          <Star size={18} fill={p.featured ? '#D97706' : 'none'} />
                        </button>
                      </td>

                      {/* Product Thumbnail & Name */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              width: '45px',
                              height: '56px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              backgroundColor: '#E2E8F0',
                              flexShrink: 0,
                            }}
                          >
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : null}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                              slug: /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ textTransform: 'capitalize' }}>{p.category}</td>

                      {/* Price */}
                      <td style={{ fontWeight: 600 }}>
                        {brandConfig.currencySymbol || '₹'}
                        {Number(p.price).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`admin-pill ${p.status}`}>{p.status}</span>
                      </td>

                      {/* Availability */}
                      <td>
                        <span
                          className={`admin-pill ${p.availability === 'Sold Out' ? 'sold-out' : 'published'}`}
                        >
                          {p.availability}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          {activeTab === 'archived' ? (
                            <>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                title="Restore to Drafts"
                                style={{ padding: '0.35rem 0.65rem' }}
                                onClick={() => handleRestore(p.id)}
                              >
                                <RotateCcw size={15} />
                                <span>Restore</span>
                              </button>

                              <button
                                type="button"
                                className="admin-btn admin-btn-danger"
                                title="Permanently Delete"
                                style={{ padding: '0.35rem 0.65rem' }}
                                onClick={() => setConfirmDeleteId(p.id)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                title="Preview Customer View"
                                style={{ padding: '0.35rem 0.55rem' }}
                                onClick={() => setPreviewProduct(p)}
                              >
                                <Eye size={15} />
                              </button>

                              <Link
                                href={`/admin/products/${p.id}/edit`}
                                className="admin-btn admin-btn-secondary"
                                title="Edit Product"
                                style={{ padding: '0.35rem 0.55rem' }}
                              >
                                <Edit3 size={15} />
                              </Link>

                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                title="Duplicate as Draft"
                                style={{ padding: '0.35rem 0.55rem' }}
                                onClick={() => handleDuplicate(p.id)}
                              >
                                <Copy size={15} />
                              </button>

                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                title="Archive (Soft Delete)"
                                style={{ padding: '0.35rem 0.55rem', color: '#DC2626' }}
                                onClick={() => setConfirmArchiveId(p.id)}
                              >
                                <Archive size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal: Archive */}
      {confirmArchiveId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '440px' }}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Archive Product?</h3>
              <button
                type="button"
                onClick={() => setConfirmArchiveId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                This product will be removed from your public website immediately. You can restore it anytime from the <strong>Archived</strong> tab.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setConfirmArchiveId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => handleArchive(confirmArchiveId)}
              >
                Archive Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Permanent Delete */}
      {confirmDeleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '460px' }}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--admin-danger)', margin: 0 }}>
                Permanently Delete Product?
              </h3>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                This action is irreversible. The product records and references will be permanently destroyed from the database.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => handlePermanentDelete(confirmDeleteId)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Preview Modal */}
      {previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}
    </AdminLayout>
  );
}
