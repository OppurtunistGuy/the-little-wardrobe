import React from 'react';
import { Link } from 'wouter';
import { brandConfig } from '../config/brandConfig';

export default function ProductCard({ product }) {
  const isSoldOut = product.availability === 'Sold Out';
  const priceFormatted = `${brandConfig.currencySymbol || '₹'}${Number(product.price).toLocaleString('en-IN')}`;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`product-card ${isSoldOut ? 'sold-out' : ''}`}
      aria-label={`View ${product.name} priced at ${priceFormatted}`}
    >
      {/* Media & Badges */}
      <div className="product-card-media">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-bg-alt)' }} />
        )}

        <div className="product-card-badge-wrap">
          {isSoldOut ? (
            <span className="badge badge-sold">Sold Out</span>
          ) : product.badge ? (
            <span className="badge badge-sage">{product.badge}</span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-price-row">
          <span className="product-card-price">{priceFormatted}</span>
          {isSoldOut && (
            <span className="product-card-status-text">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
