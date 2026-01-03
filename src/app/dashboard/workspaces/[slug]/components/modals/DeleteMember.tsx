import Garbage from "@/components/ui/icons/Garbage";
import { deleteWorkspaceMemberService } from "@/services/client/workspace.service";
import useProjectStore from "@/store/projectStore";
import useWorkspaceMemberStore from "@/store/workspaceMemberStore";
import { WorkspaceMember } from "@/types/workspace.type";
import { Modal, Button } from "@/components/ui";
import { useAppContext } from "@/providers/AppProvider";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    member: WorkspaceMember;
}


const DeleteMemberModal: React.FC<Props> = ({ isOpen, onClose, member }) => {
    const { fetchWorkspace } = useProjectStore();
    const { fetchWorkspaceMembers } = useWorkspaceMemberStore();
    const { setIsLoading } = useAppContext();

    const handleDeleteProject = async () => {
        try {
            setIsLoading(true);
            await deleteWorkspaceMemberService(member.id);
            fetchWorkspace();
            fetchWorkspaceMembers(true)
            onClose(); // Modal'ı kapat
        } catch (error) {
            console.error('Workspace silinirken bir hata oluştu:', error);
            // Hata mesajını kullanıcıya göster
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal.Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <Modal.ModalContent>
                <Modal.ModalHeader className="font-medium text-t-black text-[24px]">Üzvü silməkdən əminsiniz?</Modal.ModalHeader>
                <Modal.ModalBody className="flex flex-col justify-center items-center">
                    <Garbage />
                    <p className="font-medium text-[20px] text-t-gray">Bütün məlumatlarınız silincək</p>
                </Modal.ModalBody>
                <Modal.ModalFooter className="grid grid-cols-2 gap-[16px]">
                    <Button variant="flat" className="font-medium text-t-black rounded-[8px]" onPress={onClose}>
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

export default DeleteMemberModal;
