import { IntegrationsSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <div className="wrap" style={{ paddingTop: 140, paddingBottom: 120 }}>
      <IntegrationsSkeleton />
    </div>
  );
}
