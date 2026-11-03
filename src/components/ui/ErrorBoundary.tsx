import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Robust React 19 Error Boundary Component
 * Catches render errors and errors thrown by `use(Promise)` inside `<Suspense>` streams.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Captured by React 19 ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
    });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '0.5rem', borderRadius: '8px' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 600 }}>Stream Error Caught by ErrorBoundary</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>An asynchronous promise rejection was caught gracefully.</p>
            </div>
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(7, 9, 14, 0.7)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem',
              wordBreak: 'break-word',
            }}
          >
            {this.state.error.message || 'Unknown stream rendering failure.'}
          </div>

          <button
            type="button"
            onClick={this.resetErrorBoundary}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} />
            <span>Reset Boundary &amp; Retry</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
