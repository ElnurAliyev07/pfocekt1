

"use client"

import { Modal, ModalContent, ModalBody } from '@/components/ui/modal'
import React from 'react'

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const PageUnderConstruction = ({ isOpen, setIsOpen }: Props) => {
    const closeModal = () => {
        setIsOpen(false);
    };
    
  return (
    <Modal isOpen={isOpen} onOpenChange={closeModal}>
      <ModalContent>
        <ModalBody>
            <p>Səhifə hazırlanır</p>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PageUnderConstruction