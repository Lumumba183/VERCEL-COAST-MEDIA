import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { Newspaper, Eye, Radio, Pen } from 'lucide-react';

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  // Check if user is admin
  const { data: appUser } = await supabaseAdmin
    .from('app_users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!appUser || appUser.role !== 'admin') {
    redirect('/');
  }

  // Get stats
  const { count: articleCount } = await supabaseAdmin.from('articles').select('*', { count: 'exact', head: true });
  const { count: reportCount } = await supabaseAdmin.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { data: latestArticles } = await supabaseAdmin.from('articles').select('*').order('created_at', { ascending: false }).limit(5);
  const { data: latestReports } = await supabaseAdmin.from('reports').select('*').order('created_at', { ascending: false }).limit(5);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0a1628]">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Newspaper size={24} className="text-[#0066cc] mb-3" />
          <h3 className="text-[32px] font-bold text-[#0a1628]">{articleCount || 0}</h3>
          <p className="text-sm text-[#718096]">Total Articles</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Eye size={24} className="text-[#0066cc] mb-3" />
          <h3 className="text-[32px] font-bold text-[#0a1628]">523K</h3>
          <p className="text-sm text-[#718096]">Monthly Views</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Radio size={24} className="text-[#0066cc] mb-3" />
          <h3 className="text-[32px] font-bold text-[#0a1628]">12.5K</h3>
          <p className="text-sm text-[#718096]">Radio Listeners</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Pen size={24} className="text-[#0066cc] mb-3" />
          <h3 className="text-[32px] font-bold text-[#0a1628]">{reportCount || 0}</h3>
          <p className="text-sm text-[#718096]">Pending Submissions</p>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
        <div className="p-6 border-b border-[#e2e8f0]">
          <h3 className="text-lg font-bold text-[#0a1628]">Recent Articles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestArticles?.map((article) => (
                <tr key={article.id} className="border-b border-[#e2e8f0] last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-[#0a1628]">{article.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-[#e63946] text-white">{article.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#718096]">{article.author}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${article.status === 'published' ? 'bg-green-100 text-green-700' : article.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {article.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e2e8f0]">
          <h3 className="text-lg font-bold text-[#0a1628]">Recent Submissions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestReports?.map((report) => (
              <div key={report.id} className="p-4 border border-[#e2e8f0] rounded-xl hover:border-[#0066cc] hover:shadow-md transition-all">
                <h4 className="text-sm font-bold text-[#0a1628] mb-1">{report.anonymous ? 'Anonymous' : report.name} — {report.title}</h4>
                <p className="text-xs text-[#718096] mb-2 line-clamp-2">{report.message}</p>
                <div className="flex items-center gap-3 text-xs text-[#718096]">
                  <span>{new Date(report.created_at).toLocaleDateString('en-KE')}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
