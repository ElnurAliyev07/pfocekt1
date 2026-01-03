import { Modal, Button } from "@/components/ui";
import Garbage from "@/components/ui/icons/Garbage";
import { deletePlanningService } from "@/services/client/planning.service";
import usePlanningStore from "@/store/planningStore";
import { useState } from "react";
import { HiTrash } from "react-icons/hi";
import { Planning } from "@/types/planning.type";
import { useAppContext } from "@/providers/AppProvider";

interface Props {
    planning: Planning;
    isOpenProps?: boolean;
    hiddenButton?: boolean;
    onCloseProps?: (data: boolean) => void;
    className?: string;
}

const DeletePlanning: React.FC<Props> = ({ planning, isOpenProps, hiddenButton, onCloseProps, className }) => {
    const [isOpen, setIsOpen] = useState(isOpenProps || false);
    const onOpenChange = () => {
        setIsOpen(!isOpen);
        if (onCloseProps) onCloseProps(!isOpen);
    };
    
    const { fetchPlannings, setSelectedPlanning, plannings } = usePlanningStore();
     
    const { setIsLoading } = useAppContext();
    
    const handleDeletePlanning = async () => {
        try {
            setIsLoading(true);
            await deletePlanningService(planning.id);
            await fetchPlannings();
            
            // Find the next available planning
            const currentIndex = plannings.findIndex(p => p.id === planning.id);
            let nextPlanning;
            
            if (currentIndex > 0) {
                // If we're not at the start, select the previous planning
                nextPlanning = plannings[currentIndex - 1];
            } else if (plannings.length > 1) {
                // If we're at the start and there are other plannings, select the next one
                nextPlanning = plannings[1];
            } else {
                // If this was the last planning, set to null or undefined
                nextPlanning = null;
            }
            
            setSelectedPlanning(nextPlanning);
            onOpenChange();
        } catch (error) {
            console.error('Workspace silinirken bir hata oluştu:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {!hiddenButton && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 ${className || ''}`}
                >
                    <HiTrash className="w-4 h-4" />
                    <span>Sil</span>
                </button>
            )}
            <Modal.Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <Modal.ModalContent>
                    <Modal.ModalHeader className="font-medium text-t-black text-[24px]">Planlamanı silmək istədiyinizə əminsiniz?</Modal.ModalHeader>
                    <Modal.ModalBody className="flex flex-col justify-center items-center">
                        <Garbage />
                    </Modal.ModalBody>
                    <Modal.ModalFooter className="grid grid-cols-2 gap-2">
                        <Button variant="flat" className="bg-custom-gray font-medium text-t-black rounded-[8px]" onPress={onOpenChange}>
                            Bağla
                        </Button>
                        <Button variant="danger" onPress={handleDeletePlanning} className="font-medium rounded-[8px] text-white" type="submit">
                            Sil
                        </Button>
                    </Modal.ModalFooter>
                </Modal.ModalContent>
            </Modal.Modal>
        </>
    );
}

export default DeletePlanning;