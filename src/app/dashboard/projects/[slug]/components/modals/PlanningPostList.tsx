import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import usePlanningPostStore from "@/store/planningPostStore";
import PlanningPostItem from "../common/PlanningPostItem";
import { PlanningPost } from "@/types/planning.type";
import { useState } from "react";
import { formatDate } from "@/utils/formateDateTime";


interface Props {
    onSelect: (selectedPost: PlanningPost) => void;
}

const PlanningPostListModal: React.FC<Props> = ({ onSelect }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { planningPosts } = usePlanningPostStore()
    const [ post, setPost ] = useState<PlanningPost>()

    return (
        <>
            <Button variant="ghost" className="min-w-0 w-full text-start justify-start p-4 border rounded-[8px] border-border-gray" onPress={onOpen}>
                {
                    post ? (
                        <div className="flex items-center gap-2">
                            <span className="text-t-black font-medium">{post.type.title}: </span>
                            <span className="text-t-black font-medium">{formatDate(post.date)}</span>
                        </div>
                    ): 
                    (
                        <span className="text-t-black font-medium">Postu seçin</span>
                    )
                }
            </Button>
            <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    <ModalHeader>Postlar</ModalHeader>
                    <ModalBody className="flex flex-col justify-center items-center">
                        <div className="mt-[36px] overflow-x-auto w-full">
                            <div className="grid grid-cols-6 gap-4 text-[20px] text-center font-medium text-t-black py-3">
                                <div className="px-4">Post növü</div>
                                <div className="px-4">Paylaşılan tarix</div>
                                <div className="px-4">Qeyd</div>
                                <div className="px-4">Üzvlər</div>
                                <div className="px-4">Status</div>
                                <div className="px-4">Əməliyyat</div>
                            </div>

                            <div className="space-y-[8px] text-center">
                                {
                                    planningPosts.filter((post) => post.task === null).map((post, index) => (
                                        <PlanningPostItem onSelect={(selectedPost) => {
                                            onSelect(selectedPost); // Seçilen postu üst bileşene ilet
                                            setPost(selectedPost);
                                            onOpenChange(); // Modalı kapat
                                        }} key={index} post={post} />              
                                    ))
                                }
                                
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}


export default PlanningPostListModal;