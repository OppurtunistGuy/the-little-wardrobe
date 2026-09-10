import React from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';

// Public Storefront Pages & Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Owner Admin Panel Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProductList from './admin/AdminProductList';
import AdminProductEditor from './admin/AdminProductEditor';
import AdminSettings from './admin/AdminSettings';

// Global Styles
import './styles/variables.css';
import './styles/base.css';

function MainApp() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminRoute && <Header />}

      <main className={isAdminRoute ? 'admin-main-wrapper' : 'main-content'}>
        <Switch>
          {/* Public Storefront Routes */}
          <Route path="/" component={Home} />
          <Route path="/collection" component={Collection} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />

          {/* Dedicated Owner Admin Routes */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={AdminProductList} />
          <Route path="/admin/products/new" component={AdminProductEditor} />
          <Route path="/admin/products/:id/edit" component={AdminProductEditor} />
          <Route path="/admin/settings" component={AdminSettings} />

          {/* Fallback 404 Route */}
          <Route>
            <div className="container" style={{ padding: '6rem var(--container-px)', textAlign: 'center' }}>
              <h1 style={{ marginBottom: '1rem' }}>Page Not Found</h1>
              <p style={{ marginBottom: '2rem' }}>We could not locate the page you were looking for.</p>
              <a href="/" className="btn btn-primary">Return Home</a>
            </div>
          </Route>
        </Switch>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <MainApp />
      </CatalogProvider>
    </AuthProvider>
  );
}
