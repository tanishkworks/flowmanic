import { TableSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <section className="admin">
      <div className="wrap">
        <TableSkeleton />
      </div>
    </section>
  );
}
