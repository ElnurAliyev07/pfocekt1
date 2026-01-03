// components/modals/DeleteProjectModal.tsx
import Garbage from "@/components/ui/icons/Garbage";
import { deleteProjectService } from "@/services/client/project.service";
import usePlanningStore from "@/store/planningStore";
import useProjectStore from "@/store/projectStore";
import { Modal, Button } from "@/components/ui";
import { useAppContext } from "@/providers/AppProvider";

interface DeleteProjectProps {
    isOpen: boolean;
    onClose: () => void;
    project_slug: string;
}

const DeleteProjectModal: React.FC<DeleteProjectProps> = ({ isOpen, onClose, project_slug }) => {
    const { fetchProjects, fetchWorkspace } = useProjectStore();
    const { fetchPlannings } = usePlanningStore()
    const { setIsLoading } = useAppContext()
    const handleDeleteProject = async () => {
        try {
            setIsLoading(true)
            await deleteProjectService(project_slug);
            await fetchProjects(true);
            await fetchWorkspace();
            await fetchPlannings(); 
            onClose();
        } catch (error) {
            console.error('Workspace silinirken bir hata oluştu:', error);
            // Hata mesajını kullanıcıya göster
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Modal.Modal 
            placement="center" 
            isOpen={isOpen} 
            onOpenChange={onClose}
            size="md"
            className="mx-4"
        >
            <Modal.ModalContent>
                <Modal.ModalHeader className="font-medium text-t-black text-[24px] text-center">Proyekti silməkdən əminsiniz?</Modal.ModalHeader>
                <Modal.ModalBody className="flex flex-col justify-center items-center p-4">
                    <Garbage />
                    <p className="font-medium text-[20px] text-t-gray text-center">Bütün məlumatlarınız silincək</p>
                </Modal.ModalBody>
                <Modal.ModalFooter className="grid grid-cols-2 gap-4">
                    <Button 
                        className="bg-custom-gray font-medium text-t-black rounded-[8px] text-sm sm:text-base px-3 py-2" 
                        variant="flat"
                        onPress={onClose}>
                        Bağla
                    </Button>
                    <Button 
                        onPress={handleDeleteProject} 
                        variant="danger"
                        className="bg-custom-red font-medium rounded-[8px] text-white text-sm sm:text-base px-3 py-2" 
                        type="button">
                        Sil
                    </Button>
                </Modal.ModalFooter>
            </Modal.ModalContent>
        </Modal.Modal>
    );
};

export default DeleteProjectModal;
