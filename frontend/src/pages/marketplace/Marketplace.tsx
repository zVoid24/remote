import { useQuery } from '@tanstack/react-query';
import { specialistApi } from '@/api/specialists';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at:DESC');
  
  const { data, isLoading } = useQuery({
    queryKey: ['specialists', 'published', search, sort],
    queryFn: () => {
      const [sortBy, sortOrder] = sort.split(':');
      return specialistApi.getAll({ 
        status: 'published', 
        search,
        sortBy,
        sortOrder: sortOrder as 'ASC' | 'DESC'
      });
    },
  });

  const specialists = data?.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">ANYCOMP</h1>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#" className="text-muted-foreground hover:text-foreground">Register a company</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Appoint a Company Secretary</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Company Secretarial Services</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">How Anycomp Works</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <Input 
                placeholder="Search for services" 
                className="pl-8 h-9" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
               <img src="https://github.com/shadcn.png" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">Home / Specialists / Register a New Company</div>
          <h1 className="text-3xl font-bold mb-2">Register a New Company</h1>
          <p className="text-muted-foreground">Get Your Company Registered with a Trusted Specialists</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <select 
            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="created_at:DESC">Newest First</option>
            <option value="base_price:ASC">Price: Low to High</option>
            <option value="base_price:DESC">Price: High to Low</option>
          </select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {specialists.map((specialist: any) => (
              <div 
                key={specialist.id} 
                className="group cursor-pointer space-y-3"
                onClick={() => navigate(`/marketplace/${specialist.id}`)}
              >
                {/* Image Card */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted relative">
                  {specialist.media && specialist.media.length > 0 ? (
                    <img 
                      src={specialist.media[0].url} 
                      alt={specialist.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                      <span className="text-muted-foreground font-medium">No Image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      <span className="text-[10px] font-bold text-primary">GL</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Gwen Lam • Company Secretary</span>
                  </div>
                  
                  <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                    {specialist.title}
                  </h3>
                  
                  <div className="text-sm font-bold pt-1">
                    RM {parseFloat(specialist.base_price).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
