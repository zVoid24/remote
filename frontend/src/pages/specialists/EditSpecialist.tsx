import { useState, useRef, useEffect } from 'react';
import { ServiceOfferingsCombobox } from "../../components/specialists/ServiceOfferingsCombobox";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialistApi, serviceOfferingsApi } from '@/api/specialists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus, Menu, Mail, Bell, LayoutDashboard, Users, ShoppingCart, FileSignature, MessageSquare, Receipt, HelpCircle, Settings, ChevronLeft, ChevronRight, Loader2, AlertCircle, Edit as EditIcon, Trash2 } from 'lucide-react';

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

export default function EditSpecialist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [formData, setFormData] = useState({ title: '', description: '', base_price: '', duration_days: '' });
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Fetch specialist data
  const { data: specialistData, isLoading } = useQuery({
    queryKey: ['specialist', id],
    queryFn: () => specialistApi.getById(id!),
    enabled: !!id,
  });

  // Fetch service offerings master list
  const { data: offeringsData } = useQuery({
    queryKey: ['service-offerings-master'],
    queryFn: serviceOfferingsApi.getAll,
  });

  const specialist = specialistData?.data;
  const serviceOfferings = offeringsData?.data || [];

  // Populate form when data loads
  useEffect(() => {
    if (specialist) {
      setFormData({
        title: specialist.title,
        description: specialist.description || '',
        base_price: specialist.base_price.toString(),
        duration_days: specialist.duration_days.toString(),
      });
      setSelectedOfferings(specialist.serviceOfferings?.map((so: any) => so.service_offerings_master_list_id) || []);
    }
  }, [specialist]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => specialistApi.update(id!, data),
    onSuccess: async () => {
      // Upload images if any
      const validImages = images.filter((img): img is File => img !== null);
      if (validImages.length > 0) {
        try {
          await specialistApi.uploadMedia(id!, validImages);
        } catch (error) {
          console.error('Failed to upload images:', error);
          toast({ title: 'Warning', description: 'Specialist updated but images failed to upload', variant: 'destructive' });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      queryClient.invalidateQueries({ queryKey: ['specialist', id] });
      toast({ title: 'Success', description: 'Specialist updated successfully!' });
      setIsEditPanelOpen(false);

      // Reset image state
      setImages([null, null, null]);
      fileInputRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error?.message || 'Failed to update specialist', variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => specialistApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      toast({ title: 'Success', description: 'Specialist deleted successfully!' });
      navigate('/');
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error?.message || 'Failed to delete specialist', variant: 'destructive' });
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: () => specialistApi.publish(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      queryClient.invalidateQueries({ queryKey: ['specialist', id] });
      toast({ title: 'Success', description: 'Specialist published successfully!' });
      setIsPublishModalOpen(false);
      navigate('/marketplace');
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error?.message || 'Failed to publish specialist', variant: 'destructive' });
    },
  });

  const handleImageClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' });
        return;
      }
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

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await specialistApi.deleteMedia(id!, mediaId);
      queryClient.invalidateQueries({ queryKey: ['specialist', id] });
      toast({ title: 'Success', description: 'Image deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.error?.message || 'Failed to delete image', variant: 'destructive' });
    }
  };

  const handleUpdate = () => {
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

    updateMutation.mutate({
      title: formData.title,
      description: formData.description,
      base_price: parseFloat(formData.base_price),
      duration_days: parseInt(formData.duration_days),
      service_offerings: selectedOfferings,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Specialist not found</h2>
          <Button onClick={() => navigate('/')} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r z-40 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4">{!sidebarCollapsed && <span className="text-xs font-medium text-gray-500 uppercase">Profile</span>}</div>
        <div className="p-4 border-b">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <img src="/image.png" alt="Company Logo" className="h-10 w-10 rounded-full object-cover" />
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
      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-white z-40" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute right-3 top-3 p-1"><X className="h-5 w-5 text-gray-600" /></button>
        <div className="p-4 mt-8">
          <span className="text-xs font-medium text-gray-500 uppercase">Profile</span>
        </div>
        <div className="px-4 pb-4 border-b">
          <div className="flex items-center gap-3">
            <img src="/image.png" alt="Company Logo" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium text-gray-900">Gwen Lam</p>
              <p className="text-xs text-gray-500">ST Comp Holdings Sdn Bhd</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-4">{mainNavItems.map((item) => (<a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${item.path === '/' ? 'bg-[#003366] text-white' : 'text-gray-600'}`}><item.icon className="h-5 w-5" /><span>{item.label}</span></a>))}</nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2"><Menu className="h-5 w-5" /></button>
            <div><p className="text-xs text-muted-foreground">Dashboard {'>'} Specialists</p><h1 className="text-lg font-semibold">Edit Specialist</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2"><Mail className="h-5 w-5 text-muted-foreground" /></button>
            <button className="p-2 relative"><Bell className="h-5 w-5 text-muted-foreground" /><span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" /></button>
            <img src="/image.png" alt="Profile" className="h-8 w-8 rounded-full ml-2 object-cover" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Service Preview */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">{specialist.title}</h2>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden"
                  onClick={() => setIsEditPanelOpen(true)}
                >
                  {specialist.media && specialist.media.length > 0 ? (
                    <>
                      <img src={specialist.media[0].url} className="w-full h-full object-cover" alt="Service Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium flex items-center gap-2">
                          <EditIcon className="h-4 w-4" /> Edit Images
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground text-center px-4 mt-2">Upload an image for your service</span>
                    </>
                  )}
                </div>
                <div className="grid gap-4">
                  <div className="aspect-video bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <span className="text-3xl font-bold">10+</span>
                      <p className="text-sm mt-2">Best Company Secretarial in Johor Bahru</p>
                    </div>
                  </div>
                  <div className="aspect-video bg-gradient-to-r from-rose-700 to-rose-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <p className="text-sm">A Company Secretary Represents a Key Role</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground mt-2">{specialist.description || 'Describe your service here'}</p>
              </div>

              {/* Additional Offerings */}
              <div>
                <h3 className="text-lg font-semibold">Additional Offerings</h3>
                <p className="text-sm text-muted-foreground mt-1">Enhance your service by adding additional offerings</p>
              </div>

              {/* Company Secretary Section (Mock) */}
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <h3 className="text-lg font-semibold">Company Secretary</h3>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Grace Lam</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Owner</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Corpec Services Sdn Bhd</p>
                    <p className="text-xs text-muted-foreground">250 Clients • 4.4 ⭐</p>
                    <Button size="sm" className="mt-2 text-xs">View Profile</Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey.</p>
              </div>
            </div>

            {/* Right Side - Actions & Pricing */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-[#003366] text-white hover:bg-[#002244] hover:text-white" onClick={() => setIsEditPanelOpen(true)}>
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {specialist.is_draft && (
                  <Button className="flex-1 bg-[#003366] text-white hover:bg-[#002244]" onClick={() => setIsPublishModalOpen(true)}>
                    Publish
                  </Button>
                )}
              </div>

              {/* Pricing Card */}
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Professional Fee</h3>
                  <p className="text-sm text-muted-foreground">Set a rate for your service</p>
                </div>
                <div className="text-4xl font-bold underline">RM {specialist.base_price.toLocaleString()}</div>
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base price</span>
                    <span>RM {specialist.base_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary underline cursor-pointer">Service processing fee</span>
                    <span>RM {specialist.platform_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>RM {specialist.final_price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm pt-4 border-t">
                  <span className="text-muted-foreground">Your returns</span>
                  <span className="font-medium">RM {specialist.base_price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Edit Panel (Slide-out) */}
      <AnimatePresence>
        {isEditPanelOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !updateMutation.isPending && setIsEditPanelOpen(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Edit Service</h2>
                <button onClick={() => setIsEditPanelOpen(false)} className="p-1"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Enter your service title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your service here"
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">(500 words)</p>
                </div>

                {/* Time & Price */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Estimated Completion Time (Days)</Label>
                    <Input type="number" value={formData.duration_days} onChange={e => setFormData(p => ({ ...p, duration_days: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label>Price</Label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 bg-muted border-r rounded-l-md">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <span className="text-base">🇲🇾</span> MYR
                        </span>
                      </div>
                      <Input type="number" value={formData.base_price} onChange={e => setFormData(p => ({ ...p, base_price: e.target.value }))} className="pl-24" />
                    </div>
                  </div>
                </div>

                {/* Additional Offerings */}
                <div className="space-y-2">
                  <Label>Additional Offerings</Label>
                  <ServiceOfferingsCombobox
                    offerings={serviceOfferings}
                    selectedOfferings={selectedOfferings}
                    onChange={setSelectedOfferings}
                  />
                </div>

                {/* Service Images */}
                <div className="space-y-4">
                  <Label>Service Images</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Image {i + 1}</Label>
                        <div className="relative">
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
                                <img src={URL.createObjectURL(images[i]!)} className="w-full h-full object-cover" alt={`Upload ${i + 1}`} />
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            ) : specialist?.media?.[i] ? (
                              <>
                                <img src={specialist.media[i].url} className="w-full h-full object-cover" alt="Current" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this image?')) {
                                      handleDeleteMedia(specialist.media[i].id);
                                    }
                                  }}
                                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-primary mb-2" />
                                <span className="text-xs text-muted-foreground">Click to upload</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t bg-card sticky bottom-0">
                <Button variant="outline" onClick={() => setIsEditPanelOpen(false)} className="flex-1" disabled={updateMutation.isPending}>Cancel</Button>
                <Button onClick={handleUpdate} className="flex-1" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Confirm
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Publish Confirmation Modal */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !publishMutation.isPending && setIsPublishModalOpen(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-lg shadow-xl z-50 p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-[#0B2147]">Publish changes</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Do you want to publish these changes? It will appear in the marketplace listing
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsPublishModalOpen(false)} className="flex-1" disabled={publishMutation.isPending}>
                    Continue Editing
                  </Button>
                  <Button onClick={() => publishMutation.mutate()} className="flex-1 bg-[#003366] hover:bg-[#002244]" disabled={publishMutation.isPending}>
                    {publishMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Save changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
