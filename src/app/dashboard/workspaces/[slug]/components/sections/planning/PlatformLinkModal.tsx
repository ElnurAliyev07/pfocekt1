import React, { useEffect, useState } from "react";
import { HiLink, HiPencil, HiTrash } from "react-icons/hi";
import { Modal } from "@/components/ui/modal";
import {
  updatePlanningPlatformService,
  deletePlanningPlatformService,
} from "@/services/client/planning.service";
import usePlanningStore from "@/store/planningStore";

// Constants
const PLATFORM_PLACEHOLDERS: Record<string, string> = {
  instagram: "https://www.instagram.com/username",
  facebook: "https://www.facebook.com/username",
  tiktok: "https://www.tiktok.com/@username",
  youtube: "https://www.youtube.com/@username",
};

interface PlatformLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: any;
  planning: any;
}

const PlatformLinkModal: React.FC<PlatformLinkModalProps> = ({
  isOpen,
  onClose,
  platform,
  planning,
}) => {
  const [link, setLink] = useState(platform?.link || "");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { fetchPlannings } = usePlanningStore();

  useEffect(() => {
    setLink(platform?.link || "");
    setError("");
    setIsEditing(false);
  }, [platform]);

  const handleUpdate = async () => {
    try {
      new URL(link);
    } catch (error) {
      setError("Düzgun bir URL daxil edin.");
      return;
    }

    try {
      await updatePlanningPlatformService(platform.id, { link });
      await fetchPlannings();
      setError("");
      setIsEditing(false);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setError("Link yenilənərkən xəta baş verdi.");
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlanningPlatformService(platform.id);
      await fetchPlannings();
      onClose();
    } catch (error) {
      console.error("Link silinirken bir hata oluştu:", error);
      setError("Link silinərkən xəta baş verdi.");
    }
  };

  return (
    <Modal hideCloseButton isOpen={isOpen} onOpenChange={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiLink className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-gray-900">
              {platform?.title} linki
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-500 hover:text-primary transition-colors"
            >
              <HiPencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              {isEditing ? (
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 border-primary focus:border-primary"
                  placeholder={
                    platform ? PLATFORM_PLACEHOLDERS[platform.title] : ""
                  }
                />
              ) : (
                <input
                  type="text"
                  className="w-full h-10 px-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 border-green-500 focus:border-green-500 pr-20"
                  placeholder={
                    platform ? PLATFORM_PLACEHOLDERS[platform.title] : ""
                  }
                  value={platform?.link || ""}
                  readOnly
                />
              )}
              {!isEditing && (
                <a
                  href={platform?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-primary hover:text-primary-darker transition-colors"
                >
                  Linkə keç
                </a>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-xs text-gray-500">
              Nümunə: {platform ? PLATFORM_PLACEHOLDERS[platform.title] : ""}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setLink(platform?.link || "");
                    setError("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-darker rounded-lg"
                >
                  Yadda saxla
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Bağla
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PlatformLinkModal; 