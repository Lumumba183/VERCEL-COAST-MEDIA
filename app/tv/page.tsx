import { Tv } from 'lucide-react';
import TvEmbed from '@/components/TvEmbed';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'TV Live' };

export default function TvPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-extrabold text-newsbooth-navy border-l-4 border-newsbooth-red pl-3 mb-2 flex items-center gap-3">
        <Tv size={28} /> TV Live
      </h1>
      <p className="text-gray-500 mb-8">Watch live broadcasts, news bulletins and  documentaries.</p>
      <TvEmbed />
    </div>
  );
}
