import { Modal, Button } from "@/components/ui";
import Trash from "../icons/Trash";
import Garbage from "@/components/ui/icons/Garbage";
import { deletePlanningPlatformService } from "@/services/client/planning.service";
import usePlanningStore from "@/store/planningStore";
import { useState } from "react";


interface Props {
    link_id: number
}

const DeleteLink: React.FC<Props> = ({ link_id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpenChange = () => setIsOpen(!isOpen);
    const onOpen = () => setIsOpen(true);
    
    const { fetchPlannings } = usePlanningStore();

    const handleDeleteLink = async () => {
        try {
            await deletePlanningPlatformService(link_id);
            fetchPlannings();
            onOpenChange();
        } catch (error) {
            console.error('Workspace silinirken bir hata oluştu:', error);
        }
    }

    return (
        <>
            <Button variant="flat" className="bg-transparent min-w-0 !p-2" onPress={onOpen}>
                <Trash />
            </Button>
            <Modal.Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <Modal.ModalContent>
                    <Modal.ModalHeader className="font-medium text-t-black text-[24px]">Linki silməkdən əminsiniz?</Modal.ModalHeader>
                    <Modal.ModalBody className="flex flex-col justify-center items-center">
                        <Garbage />
                    </Modal.ModalBody>
                    <Modal.ModalFooter className="grid grid-cols-2 gap-4">
                        <Button variant="flat" className="bg-custom-gray font-medium text-t-black rounded-[8px]" onPress={onOpenChange}>
                            Bağla
                        </Button>
                        <Button variant="danger" onPress={handleDeleteLink} className="bg-custom-red font-medium rounded-[8px] text-white" type="submit">
                            Sil
                        </Button>
                    </Modal.ModalFooter>
                </Modal.ModalContent>
            </Modal.Modal>
        </>
    );
}


export default DeleteLink;