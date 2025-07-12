import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default' | 'success' | 'warning';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <XCircle className="h-6 w-6 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'success':
        return 'default';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;