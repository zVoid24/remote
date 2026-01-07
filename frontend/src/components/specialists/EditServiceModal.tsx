import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Specialist, ServiceOfferingsMasterList } from '@/types/specialist';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialist: Specialist;
  offerings: ServiceOfferingsMasterList[];
}

export function EditServiceModal({
  isOpen,
  onClose,
  specialist,
  offerings,
}: EditServiceModalProps) {
  const [formData, setFormData] = useState({
    title: specialist.title,
    description: specialist.description,
    duration_days: specialist.duration_days.toString(),
    base_price: specialist.base_price.toString(),
  });
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>(['1', '2', '3']);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeOffering = (id: string) => {
    setSelectedOfferings(prev => prev.filter(o => o !== id));
  };

  const handleConfirm = () => {
    console.log('Updating specialist:', formData, selectedOfferings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Edit Service</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="modal-title">Title</Label>
                <Input
                  id="modal-title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="modal-description">Description</Label>
                <Textarea
                  id="modal-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  (500 words)
                </p>
              </div>

              {/* Estimated Completion Time */}
              <div className="space-y-2">
                <Label htmlFor="modal-duration">Estimated Completion Time (Days)</Label>
                <Input
                  id="modal-duration"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => handleInputChange('duration_days', e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="modal-price">Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground flex items-center gap-1">
                    <span className="text-xs">🇲🇾</span> MYR
                  </span>
                  <Input
                    id="modal-price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => handleInputChange('base_price', e.target.value)}
                    className="pl-20"
                  />
                </div>
              </div>

              {/* Additional Offerings */}
              <div className="space-y-2">
                <Label>Additional Offerings</Label>
                <Input placeholder="Search offerings..." />
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedOfferings.map((id) => {
                    const offering = offerings.find(o => o.id === id);
                    if (!offering) return null;
                    return (
                      <motion.span
                        key={id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm text-foreground"
                      >
                        {offering.title}
                        <button
                          onClick={() => removeOffering(id)}
                          className="p-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
