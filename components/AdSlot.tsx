import { getActiveAdverts } from '@/lib/data';
import type { AdPlacement } from '@/types';

/**
 * Server component: renders the first live advert for a placement.
 * Renders nothing when no advert is booked — the layout collapses cleanly.
 */
export default async function AdSlot({ placement, className = '' }: { placement: AdPlacement; className?: string }) {
  const ads = await getActiveAdverts();
  const ad = ads.find((a) => a.placement === placement);
  if (!ad) return null;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ad.image_url}
      alt={ad.title}
      className={
        placement === 'sidebar'
          ? 'w-full rounded-xl object-cover'
          : 'w-full max-h-[120px] object-contain rounded-xl bg-white'
      }
    />
  );

  return (
    <div className={className}>
      <p className="text-[9px] font-bold tracking-[0.25em] text-gray-300 uppercase mb-1 text-center">Advertisement</p>
      {ad.link_url ? (
        <a href={ad.link_url} target="_blank" rel="noopener noreferrer sponsored" className="block hover:opacity-90 transition">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
