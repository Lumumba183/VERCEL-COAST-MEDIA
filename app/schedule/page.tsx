import Link from 'next/link';
import { getSchedule } from '@/lib/data';
import { DAYS_OF_WEEK } from '@/types';
import { CalendarDays, Clock, User } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Programme Schedule' };

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { day } = await searchParams;
  const today = new Date().toLocaleDateString('en-KE', { weekday: 'long' });
  const activeDay = day && DAYS_OF_WEEK.includes(day) ? day : today;
  const items = await getSchedule(activeDay);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-2 flex items-center gap-3">
        <CalendarDays size={28} /> Programme Schedule
      </h1>
      <p className="text-gray-500 mb-8">Radio Coast weekly line-up — all times East Africa Time (EAT).</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {DAYS_OF_WEEK.map((d) => (
          <Link
            key={d}
            href={`/schedule?day=${d}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              d === activeDay ? 'bg-coast-navy text-white' : 'bg-white text-coast-navy hover:bg-gray-100'
            }`}
          >
            {d}
            {d === today && <span className="ml-1.5 text-[10px] text-coast-gold">●</span>}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
          No programmes listed for {activeDay} yet. Staff can add shows in <strong>Admin → Schedule</strong>.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="sm:w-44 shrink-0">
                <p className="flex items-center gap-2 text-coast-red font-bold">
                  <Clock size={16} /> {s.start_time} – {s.end_time}
                </p>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-coast-navy text-lg">{s.show_name}</h2>
                {s.host && (
                  <p className="text-sm text-coast-blue font-semibold flex items-center gap-1.5 mt-0.5">
                    <User size={14} /> {s.host}
                  </p>
                )}
                {s.description && <p className="text-sm text-gray-500 mt-2">{s.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
