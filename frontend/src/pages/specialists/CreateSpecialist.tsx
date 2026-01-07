import { useState, useRef } from 'react';
import { ServiceOfferingsCombobox } from "../../components/specialists/ServiceOfferingsCombobox";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { specialistApi, serviceOfferingsApi } from '@/api/specialists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus, Menu, Mail, Bell, LayoutDashboard, Users, ShoppingCart, FileSignature, MessageSquare, Receipt, HelpCircle, Settings, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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

export default function CreateSpecialist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', base_price: '', duration_days: '' });
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);

  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Fetch service offerings master list
  const { data: offeringsData } = useQuery({
    queryKey: ['service-offerings-master'],
    queryFn: serviceOfferingsApi.getAll,
  });

  const serviceOfferings = offeringsData?.data || [];

  // Create specialist mutation
  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string; base_price: number; duration_days: number; is_draft: boolean; service_offerings?: string[] }) => 
      specialistApi.create(data),
    onSuccess: async (newSpecialist, variables) => {
      // Upload images if any
      const validImages = images.filter((img): img is File => img !== null);
      if (validImages.length > 0) {
        try {
          await specialistApi.uploadMedia(newSpecialist.data.id, validImages);
        } catch (error) {
          console.error('Failed to upload images:', error);
          toast({ title: 'Warning', description: 'Specialist created but images failed to upload', variant: 'destructive' });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      toast({ title: 'Success', description: 'Specialist created successfully!' });
      if (variables.is_draft) {
        navigate('/');
      } else {
        navigate('/marketplace');
      }
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.error?.message || 'Failed to create specialist', 
        variant: 'destructive' 
      });
    },
  });

  const handleImageClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' });
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Error', description: 'Image size must be less than 5MB', variant: 'destructive' });
        return;
      }
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = '';
    }
  };

  const handleSubmit = (isDraft: boolean) => {
    // Validation
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      toast({ title: 'Error', description: 'Valid price is required', variant: 'destructive' });
      return;
    }
    if (!formData.duration_days || parseInt(formData.duration_days) <= 0) {
      toast({ title: 'Error', description: 'Valid duration is required', variant: 'destructive' });
      return;
    }

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      base_price: parseFloat(formData.base_price),
      duration_days: parseInt(formData.duration_days),
      is_draft: isDraft,
      service_offerings: selectedOfferings,
    });
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r z-40 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4">{!sidebarCollapsed && <span className="text-xs font-medium text-gray-500 uppercase">Profile</span>}</div>
        <div className="p-4 border-b">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"><span className="text-gray-700 font-medium text-sm">GL</span></div>
            {!sidebarCollapsed && <div><p className="text-sm font-medium text-gray-900">Gwen Lam</p><p className="text-xs text-gray-500">ST Comp Holdings Sdn Bhd</p></div>}
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-6">
          {mainNavItems.map((item) => (
            <a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${item.path === '/' ? 'bg-[#003366] text-white' : 'text-gray-600 hover:bg-gray-100'} ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <item.icon className="h-5 w-5" />{!sidebarCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
        <div className="px-3 pb-4 space-y-1 mt-auto">
          {bottomNavItems.map((item) => (<a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 ${sidebarCollapsed ? 'justify-center' : ''}`}><item.icon className="h-5 w-5" />{!sidebarCollapsed && <span>{item.label}</span>}</a>))}
        </div>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 h-6 w-6 flex items-center justify-center rounded-full bg-white border shadow-sm hover:bg-gray-50">{sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute right-3 top-3 p-1"><X className="h-5 w-5 text-gray-600" /></button>
        <nav className="flex-1 px-3 space-y-1 mt-16">{mainNavItems.map((item) => (<a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${item.path === '/' ? 'bg-[#003366] text-white' : 'text-gray-600'}`}><item.icon className="h-5 w-5" /><span>{item.label}</span></a>))}</nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2"><Menu className="h-5 w-5" /></button>
            <div><p className="text-xs text-muted-foreground">Dashboard {'>'} Specialists</p><h1 className="text-lg font-semibold">Create Specialist</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2"><Mail className="h-5 w-5 text-muted-foreground" /></button>
            <button className="p-2 relative"><Bell className="h-5 w-5 text-muted-foreground" /><span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" /></button>
            <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center ml-2"><span className="text-white text-xs">GL</span></div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div><h2 className="text-2xl font-bold">Create New Service</h2><p className="text-sm text-muted-foreground">Fill in the details to create a new specialist service</p></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/')} disabled={createMutation.isPending}>Cancel</Button>
                <Button variant="outline" onClick={() => handleSubmit(true)} disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save as Draft
                </Button>
                <Button onClick={() => handleSubmit(false)} disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Publish
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Enter service title" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your service here" rows={5} value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (RM) *</Label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 bg-muted border-r rounded-l-md">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="text-base">🇲🇾</span> MYR
                      </span>
                    </div>
                    <Input id="price" type="number" placeholder="0.00" value={formData.base_price} onChange={e => setFormData(p => ({...p, base_price: e.target.value}))} className="pl-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Completion Time (Days) *</Label>
                  <Input id="duration" type="number" placeholder="1" value={formData.duration_days} onChange={e => setFormData(p => ({...p, duration_days: e.target.value}))} />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Service Images</Label>
                <p className="text-sm text-muted-foreground">Upload up to 3 images (Max 5MB each)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="relative">
                      <input
                        ref={fileInputRefs[i]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(i, e)}
                      />
                      <div 
                        onClick={() => handleImageClick(i)}
                        className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden"
                      >
                        {images[i] ? (
                          <>
                            <img src={URL.createObjectURL(images[i]!)} className="w-full h-full object-cover rounded-lg" alt={`Upload ${i+1}`} />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground mt-2">Image {i+1}</span>
                            <span className="text-xs text-muted-foreground">Click to upload</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <ServiceOfferingsCombobox 
                  offerings={serviceOfferings}
                  selectedOfferings={selectedOfferings}
                  onChange={setSelectedOfferings}
                />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
