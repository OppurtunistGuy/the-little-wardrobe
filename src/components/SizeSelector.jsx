import React from 'react';

export default function SizeSelector({ sizes = [], selectedSize, onSelectSize }) {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="size-selector-wrap">
      <div className="size-selector-header">
        <span className="size-selector-label">Select Size</span>
        {selectedSize && (
          <span className="size-selector-value">Size: {selectedSize}</span>
        )}
      </div>

      <div className="size-options-grid" role="radiogroup" aria-label="Available sizes">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`size-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectSize(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
