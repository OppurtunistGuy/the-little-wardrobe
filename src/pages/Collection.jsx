import React, { useState, useMemo } from 'react';
import { categories } from '../data/products';
import { useCatalog } from '../context/CatalogContext';
import ProductCard from '../components/ProductCard';
import '../styles/collection.css';

export default function Collection() {
  const { publicProducts, loading } = useCatalog();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let list = activeCategory === 'all' 
      ? [...publicProducts] 
      : publicProducts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: featured first, then available before sold out
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.availability === 'Available' && b.availability !== 'Available') return -1;
        if (a.availability !== 'Available' && b.availability === 'Available') return 1;
        return 0;
      });
    }

    return list;
  }, [activeCategory, sortBy]);

  return (
    <div className="collection-page">
      {/* Header */}
      <div className="collection-header">
        <div className="container">
          <span className="section-subtitle">The Complete Edition</span>
          <h1 className="collection-title">Curated Catalog</h1>
          <p className="collection-desc">
            Breezy co-ords, easy-fitting midi dresses, soft tops, and relaxed bottoms woven from pure breathable textiles.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        {/* Toolbar: Category Pills & Sort */}
        <div className="collection-toolbar">
          <div className="category-tabs" role="tablist" aria-label="Filter by product category">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="collection-meta-row">
            <span className="product-count-text">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'silhouette' : 'silhouettes'}
            </span>

            <div className="sort-select-wrap">
              <label htmlFor="sort-select" className="sr-only">Sort products</label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid (PRD: Mobile 2 columns, Desktop 4 columns) */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="collection-empty-state">
            <h3 style={{ marginBottom: '0.5rem' }}>No pieces found in this category</h3>
            <p style={{ marginBottom: '1.5rem' }}>Try choosing another category tab above to explore our silhouettes.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveCategory('all')}
            >
              Show All Silhouettes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
