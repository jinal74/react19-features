import React, { useState } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';

interface LiveResizeObserverCardProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * React 19 Ref Cleanup Function Demonstration:
 * 
 * Demonstrates:
 * 1. Attaching a `ResizeObserver` inside `ref={(node) => { ... }}`
 * 2. Returning a clean-up callback: `return () => observer.disconnect();`
 * 
 * React 19 executes this cleanup automatically when the component unmounts
 * or when the DOM node changes, eliminating memory leaks!
 */
export const LiveResizeObserverCard: React.FC<LiveResizeObserverCardProps> = ({
  title = 'Responsive Container',
  children,
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  return (
    <div
      className="glass-panel"
      style={{ padding: '1.25rem', position: 'relative' }}
      /* React 19 Ref Callback with Returned Cleanup Function */
      ref={(node: HTMLDivElement | null) => {
        if (!node) return;

        // 1. Setup ResizeObserver on the DOM node
        const observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            setDimensions({
              width: Math.round(width),
              height: Math.round(height),
            });
          }
        });

        observer.observe(node);

        // 2. React 19 REF CLEANUP: Returned callback runs automatically on unmount!
        return () => {
          observer.disconnect();
        };
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div className="badge" style={{ margin: 0 }}>
          <Sparkles size={12} /> React 19: Ref Cleanup Function
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Maximize2 size={13} style={{ color: 'var(--accent-primary)' }} />
          <span className="mono">
            {dimensions.width}px × {dimensions.height}px
          </span>
        </div>
      </div>

      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h4>
      {children}
    </div>
  );
};
