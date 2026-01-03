import Garbage from "@/components/ui/icons/Garbage";
import { deleteProjectMemberService } from "@/services/client/project.service";
import useProjectMemberStore from "@/store/projectMemberStore";
import useTaskStore from "@/store/taskStore";
import { WorkspaceMember } from "@/types/workspace.type";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import Button from "@/components/ui/Button";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    member: WorkspaceMember;
}

const DeleteMemberModal: React.FC<Props> = ({ isOpen, onClose, member }) => {
    const { fetchProject } = useTaskStore();
    const { fetchProjectMembers } = useProjectMemberStore();

    const handleDeleteProject = async () => {
        try {
            await deleteProjectMemberService(member.id);
            fetchProject();
            fetchProjectMembers(true)
            onClose(); // Modal'ı kapat
        } catch (error) {
            console.error('Member silinirken bir hata oluştu:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>Üzvü silməkdən əminsiniz?</ModalHeader>
                <ModalBody className="flex flex-col justify-center items-center">
                    <Garbage />
                    <p className="font-medium text-[20px] text-t-gray">Bütün məlumatlarınız silincək</p>
                </ModalBody>
                <ModalFooter className="grid grid-cols-2">
                    <Button variant="flat" className="font-medium text-t-black rounded-[8px]" onPress={onClose}>
                        Bağla
                    </Button>
                    <Button variant="primary" onPress={handleDeleteProject} className="bg-custom-red font-medium rounded-[8px] text-white" type="submit">
                        Sil
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteMemberModal;
