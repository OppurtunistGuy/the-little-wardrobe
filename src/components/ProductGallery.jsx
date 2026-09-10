import React, { useState } from 'react';

export default function ProductGallery({ images = [], productName = 'Product' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="gallery-main-wrap">
        <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-bg-alt)' }} />
      </div>
    );
  }

  const currentImage = images[activeIndex] || images[0];

  return (
    <div className="product-gallery">
      {/* Primary Hero Image */}
      <div className="gallery-main-wrap">
        <img
          src={currentImage}
          alt={`${productName} — View ${activeIndex + 1}`}
          className="gallery-main-img"
        />
      </div>

      {/* Thumbnails (desktop & tablet) & Pagination */}
      {images.length > 1 && (
        <>
          <div className="gallery-thumbs" role="tablist" aria-label="Product thumbnail images">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeIndex === idx}
                aria-label={`View photo ${idx + 1} of ${productName}`}
                className={`gallery-thumb-btn ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <img
                  src={img}
                  alt=""
                  className="gallery-thumb-img"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Dots indicator for quick mobile visual cues */}
          <div className="gallery-dots" aria-hidden="true">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`gallery-dot ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
