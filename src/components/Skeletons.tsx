/** Loading placeholders shown by Suspense / loading.tsx while data streams in. */
export function IntegrationsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading integrations">
      <div className="int-grid">
        {Array.from({ length: count }, (_, i) => (
          <div className="sk-card" key={i}>
            <div className="sk sk-line" style={{ width: '38%' }} />
            <div className="sk sk-title" />
            <div className="sk sk-line" />
            <div className="sk sk-line" style={{ width: '80%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="wrap" aria-busy="true" aria-label="Loading" style={{ paddingTop: 140, paddingBottom: 120 }}>
      <div className="sk sk-line" style={{ width: 140, marginBottom: 24 }} />
      <div className="sk sk-title" style={{ height: 64, width: '70%', marginBottom: 40 }} />
      <div className="detail-grid">
        <div className="sk sk-block" />
        <div className="sk sk-block" style={{ height: 260 }} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading leads" style={{ display: 'grid', gap: 10 }}>
      {Array.from({ length: rows }, (_, i) => (
        <div className="sk sk-line" key={i} style={{ height: 44 }} />
      ))}
    </div>
  );
}
