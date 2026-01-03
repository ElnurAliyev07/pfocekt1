import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Portfolio } from "@/types/portfolio.type";
import Image from "next/image";

interface PortfolioViewModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  project: Portfolio | null;
}

const PortfolioViewModal: React.FC<PortfolioViewModalProps> = ({
  isOpen,
  onOpenChange,
  project,
}) => {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader>{project.title}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 max-h-[60vh] overflow-y-auto p-1">
            {project.medias && project.medias.length === 1 && (
              <div className="relative aspect-video w-full h-auto rounded-lg overflow-hidden col-span-full">
                <Image
                  src={project.medias[0].image}
                  alt={`${project.title} media 1`}
                  layout="fill"
                  objectFit="contain"
                  className="bg-slate-100"
                />
              </div>
            )}
            {project.medias &&
              project.medias.length > 1 &&
              project.medias.map((media, index) => (
                <div
                  key={index}
                  className="relative aspect-video w-full h-auto rounded-lg overflow-hidden"
                >
                  <Image
                    src={media.image}
                    alt={`${project.title} media ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="bg-slate-100"
                  />
                </div>
              ))}
          </div>
          <p className="text-slate-600 mt-4 text-sm sm:text-base">
            {project.description}
          </p>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 group text-sm"
              >
                Layihəyə Keçid
              </a>
            )}
            <button
              onClick={onOpenChange}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg sm:rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              Bağla
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PortfolioViewModal;
