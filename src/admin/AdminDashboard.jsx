import React from 'react';
import { Link } from 'wouter';
import { 
  PlusCircle, 
  ShoppingBag, 
  Settings, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useCatalog } from '../context/CatalogContext';
import { brandConfig } from '../config/brandConfig';

export default function AdminDashboard() {
  const { adminProducts, loading } = useCatalog();

  const total = adminProducts.length;
  const published = adminProducts.filter((p) => p.status === 'published').length;
  const drafts = adminProducts.filter((p) => p.status === 'draft').length;
  const soldOut = adminProducts.filter((p) => p.availability === 'Sold Out').length;
  const archived = adminProducts.filter((p) => p.status === 'archived').length;

  const recentProducts = [...adminProducts].slice(0, 5);

  return (
    <AdminLayout title="Catalog Dashboard">
      {/* Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Products</span>
          <span className="admin-stat-value">{total}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            Including drafts &amp; archived
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Published</span>
          <span className="admin-stat-value" style={{ color: 'var(--admin-success)' }}>
            {published}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            Visible on storefront
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Drafts</span>
          <span className="admin-stat-value" style={{ color: 'var(--admin-warning)' }}>
            {drafts}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            Unfinished / hidden
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Sold Out</span>
          <span className="admin-stat-value" style={{ color: 'var(--admin-danger)' }}>
            {soldOut}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            Marked as out of stock
          </span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-card-box" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
            <PlusCircle size={16} />
            <span>Add New Product</span>
          </Link>
          <Link href="/admin/products" className="admin-btn admin-btn-secondary">
            <ShoppingBag size={16} />
            <span>Manage All Products</span>
          </Link>
          <Link href="/admin/settings" className="admin-btn admin-btn-secondary">
            <Settings size={16} />
            <span>Update WhatsApp &amp; Policies</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
          >
            <ExternalLink size={16} />
            <span>Open Public Catalog</span>
          </a>
        </div>
      </div>

      {/* Recent Activity / Recent Products */}
      <div className="admin-card-box">
        <div className="admin-card-header">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Recent Products</h3>
          <Link
            href="/admin/products"
            style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Loading catalog...
          </div>
        ) : recentProducts.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--admin-text-sub)', marginBottom: '1rem' }}>
              No products found in the catalog.
            </p>
            <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
              <PlusCircle size={16} />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Availability</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => {
                  const primaryImage = p.images && p.images[0];
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '50px',
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
                            {p.featured && (
                              <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 600 }}>
                                ★ Featured on Home
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                      <td style={{ fontWeight: 600 }}>
                        {brandConfig.currencySymbol || '₹'}
                        {Number(p.price).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`admin-pill ${p.status}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-pill ${p.availability === 'Sold Out' ? 'sold-out' : 'published'}`}
                        >
                          {p.availability}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
