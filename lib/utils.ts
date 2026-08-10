export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-KE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export const WHATSAPP_URL = 'https://wa.me/254106216699';
export const CONTACT_PHONE = '+254 106 216 699';
export const CONTACT_EMAIL = 'support@wedialai.com';

export const CATEGORY_COLORS: Record<string, string> = {
  'National News': 'bg-coast-red',
  'County News': 'bg-coast-blue',
  'World News': 'bg-purple-600',
  Politics: 'bg-emerald-700',
  Sports: 'bg-teal-600',
  Health: 'bg-cyan-600',
  Celebrity: 'bg-pink-600',
  Swahili: 'bg-amber-600',
  Community: 'bg-indigo-600',
  Opinion: 'bg-slate-600',
};
