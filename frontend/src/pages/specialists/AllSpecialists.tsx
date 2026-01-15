import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialistApi } from '@/api/specialists';
import { FilterTab, Specialist } from '@/types/specialist';
import { Plus, Download, Search, MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight, Menu, Mail, Bell, LayoutDashboard, Users, ShoppingCart, FileSignature, MessageSquare, Receipt, HelpCircle, Settings, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Specialists', path: '/' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: ShoppingCart, label: 'Service Orders', path: '/service-orders' },
  { icon: FileSignature, label: 'eSignature', path: '/esignature' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Receipt, label: 'Invoices & Receipts', path: '/invoices' },
];

const bottomNavItems = [
  { icon: HelpCircle, label: 'Help', path: '/help' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function AllSpecialists() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Fetch specialists from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['specialists', activeTab, searchQuery, currentPage],
    queryFn: () => specialistApi.getAll({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchQuery,
      status: activeTab,
    }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: specialistApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      toast({ title: 'Success', description: 'Specialist deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete specialist', variant: 'destructive' });
    },
  });

  const specialists = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const getApprovalBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-emerald-100 text-emerald-800',
      under_review: 'bg-amber-100 text-amber-800',
      rejected: 'bg-red-500 text-white',
    };
    return <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>{status.replace('_', ' ')}</span>;
  };

  const getPublishBadge = (isDraft: boolean) => isDraft
    ? <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-100 text-rose-700">Not Published</span>
    : <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500 text-white">Published</span>;

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r z-40 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4">
          <span className={`text-xs font-medium text-gray-500 uppercase ${sidebarCollapsed ? 'hidden' : ''}`}>Profile</span>
        </div>
        <div className="p-4 border-b">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <img src="/image.png" alt="Company Logo" className="h-10 w-10 rounded-full object-cover" />
            {!sidebarCollapsed && <div><p className="text-sm font-medium text-gray-900">Gwen Lam</p><p className="text-xs text-gray-500">ST Comp Holdings Sdn Bhd</p></div>}
          </div>
        </div>
        {!sidebarCollapsed && <div className="px-4 pt-6 pb-2"><span className="text-xs font-medium text-gray-500 uppercase">Dashboard</span></div>}
        <nav className="flex-1 px-3 space-y-1 mt-2">
          {mainNavItems.map((item) => (
            <a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${item.path === '/' ? 'bg-[#003366] text-white' : 'text-gray-600 hover:bg-gray-100'} ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <item.icon className="h-5 w-5" />{!sidebarCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
        <div className="px-3 pb-4 space-y-1 mt-auto">
          {bottomNavItems.map((item) => (
            <a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <item.icon className="h-5 w-5" />{!sidebarCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </div>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 h-6 w-6 flex items-center justify-center rounded-full bg-white border shadow-sm hover:bg-gray-50">
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-sidebar z-50 transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute right-3 top-3 p-1"><X className="h-5 w-5 text-sidebar-foreground" /></button>
        <div className="p-4"><span className="text-xs font-medium text-sidebar-muted uppercase">Profile</span></div>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src="/image.png" alt="Company Logo" className="h-10 w-10 rounded-full object-cover" />
            <div><p className="text-sm font-medium text-sidebar-foreground">Gwen Lam</p><p className="text-xs text-sidebar-muted">ST Comp Holdings Sdn Bhd</p></div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-6">
          {mainNavItems.map((item) => (
            <a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${item.path === '/' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent'}`}>
              <item.icon className="h-5 w-5" /><span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-accent"><Menu className="h-5 w-5" /></button>
            <div className="hidden sm:block"><p className="text-xs text-muted-foreground">Dashboard</p><h1 className="text-lg font-semibold">Services</h1></div>
            <h1 className="sm:hidden text-lg font-semibold">Services</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-accent"><Mail className="h-5 w-5 text-muted-foreground" /></button>
            <button className="p-2 rounded-lg hover:bg-accent relative"><Bell className="h-5 w-5 text-muted-foreground" /><span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" /></button>
            <img src="/image.png" alt="Profile" className="h-8 w-8 rounded-full ml-2 object-cover" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div><h2 className="text-2xl font-bold">Specialists</h2><p className="text-sm text-muted-foreground mt-1">Create and publish your services for Client's & Companies</p></div>

            {/* Tabs */}
            <div className="flex gap-0 border-b">
              {(['all', 'drafts', 'published'] as FilterTab[]).map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }} className={`relative px-4 py-2.5 text-sm font-medium ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              ))}
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search Services" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9 bg-muted/50 border-0" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/specialists/create')}><Plus className="h-4 w-4 mr-2" />Create</Button>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="hidden md:block overflow-x-auto pb-12">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="w-12 px-4 py-3"><Checkbox checked={selectedRows.length === specialists.length && specialists.length > 0} onCheckedChange={() => setSelectedRows(selectedRows.length === specialists.length ? [] : specialists.map(s => s.id))} /></th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Purchases</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Approval Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Publish Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {isLoading ? (
                      <tr><td colSpan={8} className="px-4 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /><p className="text-sm text-muted-foreground mt-2">Loading specialists...</p></td></tr>
                    ) : error ? (
                      <tr><td colSpan={8} className="px-4 py-12 text-center text-destructive">Error loading specialists. Please try again.</td></tr>
                    ) : specialists.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No specialists found.</td></tr>
                    ) : (
                      specialists.map((s: Specialist) => (
                        <tr key={s.id} className="hover:bg-muted/30">
                          <td className="px-4 py-4"><Checkbox checked={selectedRows.includes(s.id)} onCheckedChange={() => setSelectedRows(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])} /></td>
                          <td className="px-4 py-4 text-sm">{s.title}</td>
                          <td className="px-4 py-4 text-sm">RM {s.base_price.toLocaleString()}</td>
                          <td className="px-4 py-4 text-sm">{s.total_number_of_ratings}</td>
                          <td className="px-4 py-4 text-sm">{s.duration_days} {s.duration_days === 1 ? 'Day' : 'Days'}</td>
                          <td className="px-4 py-4">{getApprovalBadge(s.verification_status)}</td>
                          <td className="px-4 py-4">{getPublishBadge(s.is_draft)}</td>
                          <td className="px-4 py-4 relative">
                            <button onClick={() => setOpenDropdown(openDropdown === s.id ? null : s.id)} className="p-1 rounded hover:bg-muted"><MoreVertical className="h-5 w-5 text-muted-foreground" /></button>
                            {openDropdown === s.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                                <div className="absolute right-8 top-0 w-40 bg-card rounded-lg shadow-lg border z-20">
                                  <button onClick={() => { setOpenDropdown(null); navigate(`/specialists/${s.id}/edit`); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-muted rounded-t-lg">
                                    <Edit className="h-4 w-4" />Edit
                                  </button>
                                  <button onClick={() => { setOpenDropdown(null); deleteMutation.mutate(s.id); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-muted rounded-b-lg">
                                    <Trash2 className="h-4 w-4" />Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y">
                {isLoading ? (
                  <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>
                ) : specialists.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">No specialists found.</div>
                ) : (
                  specialists.map((s: Specialist) => (
                    <div key={s.id} className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <div><p className="font-medium text-sm">{s.title}</p><p className="text-sm text-muted-foreground">RM {s.base_price.toLocaleString()}</p></div>
                        <button onClick={() => navigate(`/specialists/${s.id}/edit`)} className="p-1"><MoreVertical className="h-5 w-5 text-muted-foreground" /></button>
                      </div>
                      <div className="flex gap-2">{getApprovalBadge(s.verification_status)}{getPublishBadge(s.is_draft)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"><ChevronLeft className="h-4 w-4" /><span className="hidden sm:inline">Previous</span></button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`min-w-[32px] h-8 px-2 text-sm rounded-lg ${page === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{page}</button>
                ))}
                {totalPages > 5 && <span className="px-2 text-muted-foreground">...</span>}
                {totalPages > 5 && <button onClick={() => setCurrentPage(totalPages)} className={`min-w-[32px] h-8 px-2 text-sm rounded-lg ${totalPages === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{totalPages}</button>}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"><span className="hidden sm:inline">Next</span><ChevronRight className="h-4 w-4" /></button>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
