import { getSettings } from '@/lib/data';
import { Tv, PlayCircle, MonitorPlay } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Coast TV' };

export default async function TvPage() {
  const settings = await getSettings();
  const channelId = settings.youtube_channel_id || '';

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-2 flex items-center gap-3">
        <Tv size={28} /> Coast TV
      </h1>
      <p className="text-gray-500 mb-8">Watch live broadcasts, news bulletins and coastal documentaries.</p>

      {channelId ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/live_stream?channel=${channelId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Coast TV Live"
            />
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-coast-navy">Coast TV Live Stream</h2>
              <p className="text-sm text-gray-500">Broadcasting from Mombasa, Kenya</p>
            </div>
            <a
              href={`https://www.youtube.com/channel/${channelId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-coast-red text-white font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition text-sm"
            >
              <PlayCircle size={16} /> Subscribe
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <MonitorPlay size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="font-bold text-coast-navy text-lg mb-2">Channel not configured yet</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Staff can add the YouTube Channel ID in <strong>Admin → Settings</strong> to embed the Coast TV live stream here.
          </p>
        </div>
      )}
    </div>
  );
}
