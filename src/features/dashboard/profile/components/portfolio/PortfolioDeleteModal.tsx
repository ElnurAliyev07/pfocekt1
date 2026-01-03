import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Trash2 } from 'lucide-react';

interface PortfolioDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const PortfolioDeleteModal: React.FC<PortfolioDeleteModalProps> = ({ isOpen, onOpenChange, onConfirm, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={() => onOpenChange(false)} size="lg">
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Layihəni Sil</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-slate-600">
            Bu layihəni portfolionuzdan silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
          </p>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-red-600 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-sm disabled:bg-red-400"
            >
              {isLoading ? 'Silinir...' : 'Bəli, Sil'}
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg sm:rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              Ləğv Et
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PortfolioDeleteModal;
