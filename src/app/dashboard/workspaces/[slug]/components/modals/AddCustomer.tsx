'use client'

import { Modal, Button } from "@/components/ui";
import Plus from "../../../../components/ui/icons/Plus";
import { useState } from "react";

const AddCustomerModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpenChange = () => setIsOpen(!isOpen);
    const onOpen = () => setIsOpen(true);
    
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>();

    
    const handleClick = () => {
        if (email && email.includes("@")){
            setEmail("");
            setError("");
        }else{
            setError("Email daxil edin");
        }
    }


    return (
        <>
            <Button onPress={onOpen} className="bg-primary rounded-[48px] text-white text-[14px] font-medium">
                <Plus />
                <span>Müştəri əlavə et</span>
            </Button>
            <Modal.Modal
                size="lg"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <Modal.ModalContent>
                    <form>
                        <Modal.ModalHeader>Müştəri əlavə et</Modal.ModalHeader>
                        <Modal.ModalBody>
                            <div>
                                <label className="font-medium text-t-black" htmlFor="email">Email ilə dəvət et</label>
                                <div className="mt-[8px] flex gap-[8px] items-center h-[48px]">
                                    <div className="min-w-[362px] flex-1 overflow-x-auto custom-scrollbar-x border border-border-gray flex items-center gap-[8px] rounded-[16px] h-full px-[16px]">
                                        
                                        
                                        <input
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={"Email adresi daxil edin"}
                                            className="flex-1 w-full border-0 focus:ring-0 focus:outline-hidden"
                                            type="text"
                                        />
                                    </div>
                                    

                                    <button onClick={handleClick} type="button" className="whitespace-nowrap h-full bg-primary px-[20px] rounded-[12px] text-white">
                                        Əlavə et
                                    </button>
                                </div>
                                <div className="mt-[5px] min-h-[10px]">
                                    {
                                        error && <p className="text-custom-red">{error}</p>
                                    }
                                    
                                </div>
                            </div>
                          
                        </Modal.ModalBody>
                    </form>
                </Modal.ModalContent>
            </Modal.Modal>
        </>
    );
}

export default AddCustomerModal;
