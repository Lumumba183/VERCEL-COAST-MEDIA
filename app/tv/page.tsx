import { Tv } from 'lucide-react';
import TvEmbed from '@/components/TvEmbed';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Coast TV' };

export default function TvPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-2 flex items-center gap-3">
        <Tv size={28} /> Coast TV
      </h1>
      <p className="text-gray-500 mb-8">Watch live broadcasts, news bulletins and coastal documentaries.</p>
      <TvEmbed />
    </div>
  );
}
