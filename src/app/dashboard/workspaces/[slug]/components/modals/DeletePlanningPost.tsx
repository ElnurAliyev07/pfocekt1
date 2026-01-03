// components/modals/DeleteProjectModal.tsx
import Garbage from "@/components/ui/icons/Garbage";
import { deletePlanningPostService } from "@/services/client/planning.service";
import usePlanningStore from "@/store/planningStore";
import { Modal, Button } from "@/components/ui";
import { useAppContext } from "@/providers/AppProvider";
import usePlanningPostStore from "@/store/planningPostStore";

interface DeleteProjectProps {
    isOpen: boolean;
    onClose: () => void;
    post_id: number;
}

const DeletePlanningPostModal: React.FC<DeleteProjectProps> = ({ isOpen, onClose, post_id }) => {
    const { fetchPlannings } = usePlanningStore();
    const { fetchPlanningPosts } = usePlanningPostStore();
    const { setIsLoading } = useAppContext();
    const handleDeleteProject = async () => {
        try {
            setIsLoading(true);
            await deletePlanningPostService(post_id);
            await fetchPlannings();
            await fetchPlanningPosts();
            onClose();
        } catch (error) {
            console.error('Workspace silinirken bir hata oluştu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal.Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <Modal.ModalContent>
                <Modal.ModalHeader className="font-medium text-t-black text-[24px]">Postu silməkdən əminsiniz?</Modal.ModalHeader>
                <Modal.ModalBody className="flex flex-col justify-center items-center">
                    <Garbage />
                </Modal.ModalBody>
                <Modal.ModalFooter className="grid grid-cols-2 gap-4">
                    <Button variant="flat" className="bg-custom-gray font-medium text-t-black rounded-[8px]" onPress={onClose}>
                        Bağla
                    </Button>
                    <Button variant="danger" onPress={handleDeleteProject} className="bg-custom-red font-medium rounded-[8px] text-white" type="submit">
                        Sil
                    </Button>
                </Modal.ModalFooter>
            </Modal.ModalContent>
        </Modal.Modal>
    );
};

export default DeletePlanningPostModal;
