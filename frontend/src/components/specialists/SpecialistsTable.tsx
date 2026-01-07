import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Specialist } from '@/types/specialist';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface SpecialistsTableProps {
  specialists: Specialist[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SpecialistsTable({ specialists, onEdit, onDelete }: SpecialistsTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSelectAll = () => {
    if (selectedRows.length === specialists.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(specialists.map(s => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getApprovalStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      approved: 'status-approved',
      under_review: 'status-under-review',
      rejected: 'status-rejected',
      pending: 'status-draft',
    };
    const statusLabels: Record<string, string> = {
      approved: 'Approved',
      under_review: 'Under Review',
      rejected: 'Rejected',
      pending: 'Pending',
    };
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-draft'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getPublishStatusBadge = (isDraft: boolean) => {
    return isDraft ? (
      <span className="status-badge status-not-published">Not Published</span>
    ) : (
      <span className="status-badge status-published">Published</span>
    );
  };

  const formatDuration = (days: number) => {
    if (days === 1) return '1 Day';
    return `${days} Days`;
  };

  const formatPrice = (price: number) => {
    return `RM ${price.toLocaleString()}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedRows.length === specialists.length && specialists.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Purchases
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Approval Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Publish Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {specialists.map((specialist, index) => (
                <motion.tr
                  key={specialist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedRows.includes(specialist.id)}
                      onCheckedChange={() => toggleSelectRow(specialist.id)}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{specialist.title}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{formatPrice(specialist.base_price)}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{specialist.total_number_of_ratings}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{formatDuration(specialist.duration_days)}</td>
                  <td className="px-4 py-4">{getApprovalStatusBadge(specialist.verification_status)}</td>
                  <td className="px-4 py-4">{getPublishStatusBadge(specialist.is_draft)}</td>
                  <td className="px-4 py-4 relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === specialist.id ? null : specialist.id)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                    
                    <AnimatePresence>
                      {openDropdown === specialist.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 top-full mt-1 w-32 bg-card rounded-lg shadow-lg border border-border z-10"
                        >
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              navigate(`/specialists/${specialist.id}/edit`);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors rounded-t-lg"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              onDelete(specialist.id);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors rounded-b-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {specialists.map((specialist, index) => (
          <motion.div
            key={specialist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedRows.includes(specialist.id)}
                  onCheckedChange={() => toggleSelectRow(specialist.id)}
                />
                <div>
                  <p className="font-medium text-foreground text-sm">{specialist.title}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(specialist.base_price)}</p>
                </div>
              </div>
              <button
                onClick={() => setOpenDropdown(openDropdown === specialist.id ? null : specialist.id)}
                className="p-1 rounded hover:bg-muted transition-colors relative"
              >
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
                
                <AnimatePresence>
                  {openDropdown === specialist.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 top-full mt-1 w-32 bg-card rounded-lg shadow-lg border border-border z-10"
                    >
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          navigate(`/specialists/${specialist.id}/edit`);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors rounded-t-lg"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          onDelete(specialist.id);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors rounded-b-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">
                {specialist.total_number_of_ratings} purchases • {formatDuration(specialist.duration_days)}
              </span>
            </div>
            
            <div className="flex gap-2">
              {getApprovalStatusBadge(specialist.verification_status)}
              {getPublishStatusBadge(specialist.is_draft)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
