// components/modals/DeleteTaskModal.tsx
import Garbage from "@/components/ui/icons/Garbage";
import { deleteTaskService } from "@/services/client/task.service";
import useProjectMemberStore from "@/store/projectMemberStore";
import useTaskStore from "@/store/taskStore";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import usePlanningStore from "@/store/planningStore";
import { useAppContext } from "@/providers/AppProvider";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    task: number;
}


const DeleteTaskModal: React.FC<Props> = ({ isOpen, onClose, task }) => {
    const { fetchTasks, project } = useTaskStore();
    const { fetchProjectMembers } = useProjectMemberStore();
    const { setIsLoading } = useAppContext();
    const { fetchPlanning } = usePlanningStore();
    const handleDeleteProject = async () => {
        setIsLoading(true);
        try {
            await deleteTaskService(task);
            fetchTasks(true);
            fetchProjectMembers(true) 
            if(project?.planning){
                await fetchPlanning(project?.planning)
            }
            onClose(); // Modal'ı kapat
        } catch (error) {
            console.error('Task silinirken bir hata oluştu:', error);
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader className="font-medium text-t-black text-[24px]">Taskı silməkdən əminsiniz?</ModalHeader>
                <ModalBody className="flex flex-col justify-center items-center">
                    <Garbage />
                    <p className="font-medium text-[20px] text-t-gray">Bütün məlumatlarınız silincək</p>
                </ModalBody>
                <ModalFooter className="grid grid-cols-2 gap-[16px]">
                    <Button variant="flat" className="font-medium text-t-black rounded-[8px]" onPress={onClose}>
                        Bağla
                    </Button>
                    <Button variant="danger" onPress={handleDeleteProject} className="font-medium rounded-[8px]" type="submit">
                        Sil
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteTaskModal;
