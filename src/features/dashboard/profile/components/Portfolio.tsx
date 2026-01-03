import React, { useState, useEffect } from "react";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/services/client/portfolio.service";
import { User } from "@/types/auth.type";
import {
  Portfolio as PortfolioType,
  PortfolioFormValues,
} from "@/types/portfolio.type";
import { Loader2, Plus, Eye, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useDisclosure } from "@/components/ui/modal";
import Image from "next/image";
import PortfolioFormModal from "./portfolio/PortfolioFormModal";
import PortfolioViewModal from "./portfolio/PortfolioViewModal";
import PortfolioDeleteModal from "./portfolio/PortfolioDeleteModal";
import InitializerWrapper from "@/components/common/wrappers/InitializerWrapper";
import { convertFileToBase64 } from "@/utils/base64";
import { urlToFile } from "@/utils/fileUtils";

interface Props {
  user: User;
  isOwner: boolean;
}

const Portfolio: React.FC<Props> = ({ user, isOwner }) => {
  const [portfolio, setPortfolio] = useState<PortfolioType[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioType | null>(
    null
  );
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setIsLoading(true);
      try {
        const response = await getPortfolios({ user: user.id });
        setPortfolio(response.data.results);
      } catch (error) {
        console.error("Failed to fetch portfolios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolios();
  }, [user.id]);

  const editModal = useDisclosure();
  const viewModal = useDisclosure();
  const deleteModal = useDisclosure();

  const handleOpenEditModal = (project: PortfolioType) => {
    setSelectedProject(project);
    setEditMode("edit");
    editModal.onOpen();
  };

  const handleOpenCreateModal = () => {
    setSelectedProject(null);
    setEditMode("create");
    editModal.onOpen();
  };

  const handleOpenViewModal = (project: PortfolioType) => {
    setSelectedProject(project);
    viewModal.onOpen();
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeleteId(id);
    deleteModal.onOpen();
  };

  const handleCloseDeleteModal = () => {
    setDeleteId(null);
    deleteModal.onClose();
  };

  // Artıq istifadə olunmur: getBase64FromUrl

  const onSubmit = async (data: PortfolioFormValues) => {
    setIsLoading(true);
    try {
      let medias: { image: string; is_main: boolean }[] = [];
      if (data.mediaEnabled && data.medias) {
        medias = (
          await Promise.all(
            data.medias.map(async (media) => {
              if (media.image instanceof File) {
                const imageUrl = (await convertFileToBase64(
                  media.image
                )) as string;
                return { image: imageUrl, is_main: media.is_main };
              }

              if (typeof media.image === "string") {
                if (media.image.startsWith("data:")) {
                  // already base64
                  return { image: media.image, is_main: media.is_main };
                }
                const file = await urlToFile(media.image);
                const base64 = (await convertFileToBase64(file)) as string;
                return { image: base64, is_main: media.is_main };
              }

              return null;
            })
          )
        ).filter((m): m is { image: string; is_main: boolean } => m !== null);
      }

      const payload = { ...data, medias };

      if (editMode === "create") {
        const response = await createPortfolio(payload);
        setPortfolio((prev) => [response.data, ...prev]);
      } else if (editMode === "edit" && selectedProject) {
        console.log(payload);
        const response = await updatePortfolio(selectedProject.id, payload);
        setPortfolio((prev) =>
          prev.map((p) => (p.id === selectedProject.id ? response.data : p))
        );
      }
      editModal.onClose();
    } catch (error) {
      console.error("Portfolio save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await deletePortfolio(deleteId);
      setPortfolio((prev) => prev.filter((p) => p.id !== deleteId));
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Portfolio delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (item: PortfolioType) => {
    if (item.medias && item.medias.length > 0) {
      const mainImage = item.medias.find((m) => m.is_main);
      return mainImage ? mainImage.image : item.medias[0].image;
    }
    return "/link.png";
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row flex-wrap sm:flex-row items-center justify-between mb-6 gap-3 sm:gap-4">
          <div className="flex-1 text-left">
            <h1 className="text-base sm:text-3xl font-bold text-slate-900 mb-0 sm:mb-2">
              Portfolio Layihələri
            </h1>
            <p className="text-xs sm:text-base text-slate-600">
              Layihələrinizi idarə edin və yenilərini əlavə edin
            </p>
          </div>

          {portfolio.length > 0 && isOwner && (
            <button
              onClick={handleOpenCreateModal}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-6 sm:py-3 bg-indigo-600 text-white text-sm sm:text-base font-medium rounded-md sm:rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-sm sm:shadow-md hover:shadow-md sm:hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Yeni Layihə</span>
            </button>
          )}
        </div>

        <InitializerWrapper
          isLoading={isLoading}
          loadingComponent={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 animate-pulse"
                >
                  <div className="w-full h-32 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {portfolio.length === 0 ? (
              <>
                {isOwner ? (
                  <div className="col-span-full flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                      Portfolionuzda heç bir layihə yoxdur.
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 mb-4">
                      İlk layihənizi əlavə edərək portfolionuzu nümayiş etdirin.
                    </p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-5 h-5" />
                      Yeni Layihə Əlavə Et
                    </button>
                  </div>
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                      Bu istifadəçinin portfoliosunda layihə yoxdur.
                    </h3>
                  </div>
                )}
              </>
            ) : (
              portfolio.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-slate-200/50"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={getImageUrl(item)}
                      alt={item.title}
                      className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                      width={1000}
                      height={1000}
                      quality={100}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {isOwner && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                          title="Düzəliş et"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(item.id)}
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow ">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-2 leading-snug">
                      {item.description}
                    </p>
                    <div className="flex flex-row items-end gap-2 w-full  flex-grow">
                      {/* Only Link button if only link exists and no media/desc */}
                      {item.link &&
                        !item.description &&
                        (!item.medias || item.medias.length === 0) && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors group/btn"
                          >
                            Linkə Bax
                            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                        )}
                      {/* Ətraflı button if description or any media exists */}
                      {(!!item.description ||
                        (item.medias && item.medias.length > 0)) && (
                        <button
                          onClick={() => handleOpenViewModal(item)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors group/btn"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ətraflı Bax
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                      {/* Both buttons side by side if both link and (desc or media) exist */}
                      {item.link &&
                        (!!item.description ||
                          (item.medias && item.medias.length > 0)) && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors group/btn"
                          >
                            Linkə Bax
                            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </InitializerWrapper>

        <PortfolioFormModal
          isOpen={editModal.isOpen}
          onOpenChange={editModal.onOpenChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          editMode={editMode}
          selectedProject={selectedProject}
        />

        <PortfolioViewModal
          isOpen={viewModal.isOpen}
          onOpenChange={viewModal.onOpenChange}
          project={selectedProject}
        />

        <PortfolioDeleteModal
          isOpen={deleteModal.isOpen}
          onOpenChange={handleCloseDeleteModal}
          onConfirm={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Portfolio;
