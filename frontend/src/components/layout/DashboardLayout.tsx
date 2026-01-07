import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarContext } from '@/context/SidebarContext';

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumb?: string;
  title: string;
}

export function DashboardLayout({ children, breadcrumb, title }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      
      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out lg:ml-64 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
      >
        <Header breadcrumb={breadcrumb} title={title} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
