import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ items = [] }) {
  // First item open by default
  const [openIndices, setOpenIndices] = useState([0]);

  const toggle = (idx) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const validItems = items.filter(
    (item) => item && item.title && (item.content || item.customContent)
  );

  if (validItems.length === 0) return null;

  return (
    <div className="product-accordions">
      {validItems.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div key={idx} className="accordion-item">
            <button
              type="button"
              className="accordion-header"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <ChevronDown
                size={18}
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--transition-fast)',
                  color: 'var(--color-text-muted)',
                }}
              />
            </button>
            {isOpen && (
              <div className="accordion-body">
                {item.customContent ? (
                  item.customContent
                ) : (
                  <p>{item.content}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
