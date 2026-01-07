import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Menu, Mail, Bell, LayoutDashboard, Users, ShoppingCart, 
  FileSignature, MessageSquare, Receipt, HelpCircle, Settings, 
  ChevronLeft, ChevronRight, Home, ArrowLeft, Search 
} from 'lucide-react';

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

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-sidebar z-40 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4">{!sidebarCollapsed && <span className="text-xs font-medium text-sidebar-muted uppercase">Profile</span>}</div>
        <div className="p-4 border-b border-sidebar-border">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center"><span className="text-sidebar-foreground font-medium text-sm">GL</span></div>
            {!sidebarCollapsed && <div><p className="text-sm font-medium text-sidebar-foreground">Gwen Lam</p><p className="text-xs text-sidebar-muted">ST Comp Holdings Sdn Bhd</p></div>}
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-6">
          {mainNavItems.map((item) => (
            <a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <item.icon className="h-5 w-5" />{!sidebarCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
        <div className="px-3 pb-4 space-y-1 mt-auto">
          {bottomNavItems.map((item) => (<a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent ${sidebarCollapsed ? 'justify-center' : ''}`}><item.icon className="h-5 w-5" />{!sidebarCollapsed && <span>{item.label}</span>}</a>))}
        </div>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 h-6 w-6 flex items-center justify-center rounded-full bg-card border shadow-sm">{sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-sidebar z-50 transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute right-3 top-3 p-1"><ChevronLeft className="h-5 w-5 text-sidebar-foreground" /></button>
        <nav className="flex-1 px-3 space-y-1 mt-16">{mainNavItems.map((item) => (<a key={item.path} href={item.path} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80"><item.icon className="h-5 w-5" /><span>{item.label}</span></a>))}</nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2"><Menu className="h-5 w-5" /></button>
            <div><p className="text-xs text-muted-foreground">Dashboard {'>'} Error</p><h1 className="text-lg font-semibold">Page Not Found</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2"><Mail className="h-5 w-5 text-muted-foreground" /></button>
            <button className="p-2 relative"><Bell className="h-5 w-5 text-muted-foreground" /><span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" /></button>
            <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center ml-2"><span className="text-white text-xs">GL</span></div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 lg:p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full text-center space-y-8"
          >
            {/* Animated 404 Illustration */}
            <motion.div 
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-[150px] lg:text-[200px] font-bold text-primary/10 leading-none">404</div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Search className="h-24 w-24 lg:h-32 lg:w-32 text-primary/30" />
              </motion.div>
            </motion.div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold">Oops! Page Not Found</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-sm text-muted-foreground font-mono bg-muted px-4 py-2 rounded-lg inline-block">
                {location.pathname}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">You might be looking for:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mainNavItems.slice(0, 6).map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent hover:border-primary/50 transition-colors text-sm"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default NotFound;
