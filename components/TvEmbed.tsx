'use client';

import { useEffect, useState } from 'react';
import { MonitorPlay, PlayCircle, Loader2 } from 'lucide-react';

/**
 * TV Coast embed — supports YouTube or Twitch, chosen in Admin → Settings.
 * Accepts a plain channel id/name OR a full channel URL in either field.
 */
export default function TvEmbed() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, string>) => setSettings(data))
      .catch(() => setSettings({}));
  }, []);

  if (settings === null) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
        <Loader2 className="animate-spin inline mr-2" /> Loading TV Coast…
      </div>
    );
  }

  const provider = settings.tv_provider || 'youtube';

  // Extract channel id/handle from a raw value or a full URL
  const ytRaw = (settings.youtube_channel_id || '').trim();
  const ytMatch = ytRaw.match(/(?:channel\/|@)([\w.-]+)/);
  const ytChannel = ytMatch ? ytMatch[1] : ytRaw;

  const twRaw = (settings.twitch_channel || '').trim();
  const twMatch = twRaw.match(/twitch\.tv\/([\w-]+)/);
  const twChannel = twMatch ? twMatch[1] : twRaw.replace(/^@/, '');

  if (provider === 'twitch' && twChannel) {
    const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={`https://player.twitch.tv/?channel=${encodeURIComponent(twChannel)}&parent=${parent}&autoplay=false`}
            className="w-full h-full"
            allowFullScreen
            title="TV Coast — Twitch Live"
          />
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-coast-navy">TV Coast Live — Twitch</h2>
            <p className="text-sm text-gray-500">Broadcasting from Mombasa, Kenya</p>
          </div>
          <a
            href={`https://www.twitch.tv/${twChannel}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-purple-600 text-white font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition text-sm"
          >
            <PlayCircle size={16} /> Follow on Twitch
          </a>
        </div>
      </div>
    );
  }

  if (provider === 'youtube' && ytChannel) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/live_stream?channel=${ytChannel}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="TV Coast — YouTube Live"
          />
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-coast-navy">TV Coast Live — YouTube</h2>
            <p className="text-sm text-gray-500">Broadcasting from Mombasa, Kenya</p>
          </div>
          <a
            href={ytRaw.startsWith('UC') ? `https://www.youtube.com/channel/${ytRaw}` : `https://www.youtube.com/@${ytChannel}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-coast-red text-white font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition text-sm"
          >
            <PlayCircle size={16} /> Subscribe
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <MonitorPlay size={48} className="mx-auto text-gray-300 mb-4" />
      <h2 className="font-bold text-coast-navy text-lg mb-2">Channel not configured yet</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        Staff can choose YouTube or Twitch and paste the channel link in <strong>Admin → Settings</strong> to embed the TV Coast live stream here.
      </p>
    </div>
  );
}
