import { motion } from 'framer-motion';
import { useSidebarContext } from '@/context/SidebarContext';
import { Menu, Mail, Bell } from 'lucide-react';

interface HeaderProps {
  breadcrumb?: string;
  title: string;
}

export function Header({ breadcrumb = 'Dashboard', title }: HeaderProps) {
  const { toggleMobileSidebar, isCollapsed } = useSidebarContext();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>

        {/* Breadcrumb & Title */}
        <div className="hidden sm:block">
          <p className="text-xs text-muted-foreground">{breadcrumb}</p>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        
        {/* Mobile Title */}
        <h1 className="sm:hidden text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
          <Mail className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        </button>
        <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center ml-2">
          <span className="text-destructive-foreground font-medium text-xs">GL</span>
        </div>
      </div>
    </motion.header>
  );
}
