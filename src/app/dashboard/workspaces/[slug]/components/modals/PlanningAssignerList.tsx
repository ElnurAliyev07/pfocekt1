import { Modal, Button } from "@/components/ui";
import { Planning, PlanningPost } from "@/types/planning.type";
import { useState } from "react";

interface Props {
    planningPost: PlanningPost,
}

const PlanningAssignerListModal: React.FC<Props> = ({ planningPost }) => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpenChange = () => setIsOpen(!isOpen);
    const onOpen = () => setIsOpen(true);

    return (
        <>
            <button onClick={onOpen} className="text-primary">göstər</button>
            <Modal.Modal
                size="sm"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <Modal.ModalContent>
                    <Modal.ModalHeader>Təyin olunanlar</Modal.ModalHeader>
                    <Modal.ModalBody>
                        <div className="space-y-[8px] min-h-[10px]">
                            {
                                planningPost.planning_post_assigners.map((item, index) => (
                                    <div key={index} className="p-[8px] bg-gray-100 rounded-[8px]">
                                        <div className="text-t-black font-medium text-[14px]">{item.user?.full_name}</div>
                                        <div className="text-[12px] text-t-gray">{item.user?.email}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </Modal.ModalBody>
                </Modal.ModalContent>
            </Modal.Modal>
        </>
    );
}

export default PlanningAssignerListModal;
