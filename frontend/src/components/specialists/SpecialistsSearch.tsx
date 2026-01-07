import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SpecialistsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SpecialistsSearch({ value, onChange }: SpecialistsSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full sm:w-64"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Services"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
      />
    </motion.div>
  );
}
