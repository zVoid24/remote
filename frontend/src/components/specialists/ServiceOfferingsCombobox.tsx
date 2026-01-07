import React, { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, 
  Landmark, 
  Files, 
  Zap, 
  MapPin, 
  Calendar, 
  Award, 
  Truck, 
  Headset, 
  ChevronDown, 
  X, 
  Check 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ServiceOffering {
  id: string;
  title: string;
  description?: string;
}

interface ServiceOfferingsComboboxProps {
  offerings: ServiceOffering[];
  selectedOfferings: string[];
  onChange: (selected: string[]) => void;
}

export const ServiceOfferingsCombobox = ({ 
  offerings, 
  selectedOfferings, 
  onChange 
}: ServiceOfferingsComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Icon mapping based on the screenshot
  const iconMap: Record<string, any> = {
    'Company Secretary Subscription': UserPlus,
    'Opening of a Bank Account': Landmark,
    'Access Company Records and SSM Forms': Files,
    'Priority Filling': Zap,
    'Registered Office Address Use': MapPin,
    'Compliance Calendar Setup': Calendar,
    'First Share Certificate Issued Free': Award,
    'CTC Delivery & Courier Handling': Truck,
    'Chat Support': Headset,
  };

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    if (selectedOfferings.includes(id)) {
      onChange(selectedOfferings.filter(item => item !== id));
    } else {
      onChange([...selectedOfferings, id]);
    }
    // Keep open for multiple selection, clear search
    setSearch('');
    inputRef.current?.focus();
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedOfferings.filter(item => item !== id));
  };

  const filteredOfferings = offerings.filter(offering => 
    offering.title.toLowerCase().includes(search.toLowerCase())
  );

  // Scroll into view when opened
  useEffect(() => {
    if (open && containerRef.current) {
      // Small delay to ensure render
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [open]);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Service Offerings
      </label>
      
      <div 
        className={cn(
          "flex min-h-[44px] w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          open ? "ring-2 ring-ring ring-offset-2" : ""
        )}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selectedOfferings.map(id => {
          const offering = offerings.find(o => o.id === id);
          if (!offering) return null;
          return (
            <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1 py-1 text-xs font-normal">
              {offering.title}
              <div 
                role="button" 
                className="rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
                onClick={(e) => handleRemove(e, id)}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </div>
            </Badge>
          );
        })}
        
        <div className="flex-1 min-w-[120px] flex items-center">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder={selectedOfferings.length === 0 ? "Select offerings..." : ""}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </div>
        
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </div>

      {open && (
        <div className="absolute left-0 z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredOfferings.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground text-center">No offerings found.</p>
            ) : (
              <div className="space-y-1">
                {filteredOfferings.map(offering => {
                  const Icon = iconMap[offering.title] || Zap;
                  const isSelected = selectedOfferings.includes(offering.id);
                  
                  return (
                    <div
                      key={offering.id}
                      className={cn(
                        "flex items-start gap-3 rounded-sm px-3 py-3 text-sm cursor-pointer transition-colors",
                        isSelected ? "bg-accent" : "hover:bg-accent/50"
                      )}
                      onClick={() => handleSelect(offering.id)}
                    >
                      <div className="mt-0.5 shrink-0">
                        <Icon className="h-5 w-5 text-foreground/70" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="font-medium leading-none">{offering.title}</p>
                        {offering.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {offering.description}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
