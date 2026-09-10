import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  Database,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import './admin.css';

export default function AdminLayout({ children, title = 'Admin' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout, isSupabaseConfigured, isAuthenticated, loading } = useAuth();
  const { settings } = useCatalog();

  // Route protection
  if (!loading && !isAuthenticated) {
    setLocation('/admin/login');
    return null;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Add Product', path: '/admin/products/new', icon: PlusCircle },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-body">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="admin-modal-overlay"
          style={{ zIndex: 140 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand-name">{settings.brandName || 'The Little Wardrobe'}</div>
          <div className="admin-sub" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Owner Catalog Manager</div>
          
          <div style={{ marginTop: '0.5rem' }}>
            {isSupabaseConfigured ? (
              <span className="admin-badge-mode supabase">
                <Database size={11} />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="admin-badge-mode local" title="Set VITE_SUPABASE_URL & ANON_KEY in .env for production">
                <Layers size={11} />
                <span>Dev / Local Mode</span>
              </span>
            )}
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || 
              (item.path !== '/admin' && location.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
            style={{ color: '#CBD5E1' }}
          >
            <ExternalLink size={17} />
            <span>View Public Website</span>
          </a>

          <button
            type="button"
            className="admin-nav-item"
            onClick={logout}
            style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <LogOut size={17} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              style={{ display: 'flex', padding: '0.4rem', border: 'none' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{title}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)' }}>
              {user?.email || 'Owner'}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <ExternalLink size={14} />
              <span>Storefront</span>
            </a>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
