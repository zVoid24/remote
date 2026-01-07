import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { useSidebarContext } from '@/context/SidebarContext';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileSignature,
  MessageSquare,
  Receipt,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Specialists', path: '/' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: ShoppingCart, label: 'Service Orders', path: '/service-orders' },
  { icon: FileSignature, label: 'eSignature', path: '/esignature' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Receipt, label: 'Invoices & Receipts', path: '/invoices' },
];

const bottomNavItems: NavItem[] = [
  { icon: HelpCircle, label: 'Help', path: '/help' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebarContext();

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  const NavItemComponent = ({ item, isActive, collapsed = false }: { item: NavItem; isActive: boolean; collapsed?: boolean }) => (
    <Link
      to={item.path}
      onClick={closeMobileSidebar}
      className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''} ${collapsed ? 'justify-center' : ''}`}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && (
        <motion.span
          initial={false}
          animate={{ opacity: 1, width: 'auto' }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap overflow-hidden"
        >
          {item.label}
        </motion.span>
      )}
    </Link>
  );

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Profile Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-foreground font-medium text-sm">GL</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-medium text-sidebar-foreground whitespace-nowrap">Gwen Lam</p>
              <p className="text-xs text-sidebar-muted whitespace-nowrap">ST Comp Holdings Sdn Bhd</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dashboard Label */}
      {!collapsed && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="px-4 pt-6 pb-2"
        >
          <span className="text-xs font-medium text-sidebar-muted uppercase tracking-wider">
            Dashboard
          </span>
        </motion.div>
      )}

      {collapsed && <div className="pt-6" />}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {mainNavItems.map((item) => (
          <NavItemComponent
            key={item.path}
            item={item}
            isActive={location.pathname === item.path || (item.path === '/' && location.pathname.startsWith('/specialists'))}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 pb-4 space-y-1 mt-auto">
        {bottomNavItems.map((item) => (
          <NavItemComponent
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white z-40"
      >
        {/* Store Label */}
        <div className="p-4">
          {!isCollapsed && (
            <motion.span
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium text-sidebar-muted uppercase tracking-wider"
            >
              Profile
            </motion.span>
          )}
        </div>
        <SidebarContent collapsed={isCollapsed} />

        {/* Collapse Toggle - Desktop */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 h-6 w-6 flex items-center justify-center rounded-full bg-card border border-border shadow-sm hover:bg-accent transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-foreground" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileSidebar}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:hidden fixed left-0 top-0 h-full w-64 bg-sidebar z-50 flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={closeMobileSidebar}
          className="absolute right-3 top-3 p-1 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <X className="h-5 w-5 text-sidebar-foreground" />
        </button>

        {/* Store Label */}
        <div className="p-4">
          <span className="text-xs font-medium text-sidebar-muted uppercase tracking-wider">
            Profile
          </span>
        </div>
        <SidebarContent />
      </motion.aside>
    </>
  );
}
