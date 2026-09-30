'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="section" style={{ paddingTop: 180, textAlign: 'center' }}>
      <div className="wrap">
        <p className="label">Something broke</p>
        <h1 className="h2" style={{ margin: '0 auto 32px' }}>
          That Wasn&apos;t Supposed To Happen.
        </h1>
        <div className="nf-actions" style={{ paddingTop: 0 }}>
          <button className="btn btn-black" type="button" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn-ghost" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
