import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function NotFound() {
  return (
    <>
      <PageHero top="Page" bottom="Not found" title="404: page not found" meta={['Error 404', 'This page does not exist']} size="tall" />
      <div className="nf-actions">
        <Link className="btn btn-black" href="/">
          Back to home
        </Link>
        <Link className="btn btn-ghost" href="/services">
          See what we automate
        </Link>
      </div>
    </>
  );
}
