// components/modals/DeleteWorkspaceModal.tsx
import Garbage from "@/components/ui/icons/Garbage";
import { deleteWorkspaceService } from "@/services/client/workspace.service";
import useWorkspaceStore from "@/store/workspaceStore";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/providers/AppProvider";

interface DeleteWorkspaceProps {
    isOpen: boolean;
    onClose: () => void;
    workspace_slug: string;
}


const DeleteWorkspaceModal: React.FC<DeleteWorkspaceProps> = ({ isOpen, onClose, workspace_slug }) => {
    const { fetchWorkspaces } = useWorkspaceStore();
    const { setIsLoading } = useAppContext()

    const handleDeleteWorkspace = async () => {
        setIsLoading(true)
        try {
            await deleteWorkspaceService(workspace_slug);
            console.log(`${workspace_slug} başarıyla silindi.`);
            fetchWorkspaces(true);
            onClose();
        } catch (error) {
            console.error('Workspace silinirken bir hata oluştu:', error);
            // Hata mesajını kullanıcıya göster
        }finally {
            setIsLoading(false)
        }
    };

    return (
        <Modal placement="center" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="font-medium text-t-black text-lg sm:text-2xl">Virtual ofisi silməkdən əminsiniz?</ModalHeader>
                <ModalBody className="flex flex-col justify-center items-center gap-4 py-6">
                    <div className="w-20">
                        <Garbage />
                    </div>
                    <p className="font-medium text-base sm:text-xl text-t-gray text-center">
                        Bütün məlumatlarınız silincək
                    </p>
                </ModalBody>
                <ModalFooter className="grid grid-cols-2 gap-3 sm:gap-4 p-4">
                    <Button 
                        className="bg-custom-gray font-medium text-t-black rounded-[8px] text-sm sm:text-base" 
                        variant="flat"
                        onPress={onClose}>
                        Bağla
                    </Button>
                    <Button 
                        onPress={handleDeleteWorkspace} 
                        variant="danger"
                        className=" font-medium rounded-[8px] text-white text-sm sm:text-base" 
                        type="button">
                        Sil
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteWorkspaceModal;
