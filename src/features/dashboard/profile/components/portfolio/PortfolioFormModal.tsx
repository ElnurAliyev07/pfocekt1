import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Portfolio as PortfolioType,
  PortfolioFormValues,
  portfolioFormSchema,
} from "@/types/portfolio.type";
import { Input, Textarea } from "@/components/ui/form";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import FileUpload from "@/components/ui/form/input/FileUpload";
import { Trash2, Plus } from "lucide-react";

interface PortfolioFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (data: PortfolioFormValues) => void;
  isLoading: boolean;
  editMode: "create" | "edit";
  selectedProject: PortfolioType | null;
}

const PortfolioFormModal: React.FC<PortfolioFormModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  editMode,
  selectedProject,
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      mediaEnabled: false,
      medias: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medias",
  });

  const mediaEnabled = watch("mediaEnabled");

  // Auto-manage medias array when toggling media switch
  useEffect(() => {
    if (mediaEnabled) {
      // If enabled and no media yet, add an empty media slot
      if (fields.length === 0) {
        append({ image: undefined, is_main: true });
      }
    } else {
      // If disabled, clear all medias
      if (fields.length > 0) {
        fields.forEach((_, idx) => remove(idx));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaEnabled]);

  useEffect(() => {
    if (isOpen) {
      if (editMode === "edit" && selectedProject) {
        reset({
          title: selectedProject.title,
          description: selectedProject.description ?? "",
          link: selectedProject.link ?? "",
          mediaEnabled:
            !!selectedProject.medias && selectedProject.medias.length > 0,
          medias: selectedProject.medias.map((m) => ({
            image: m.image,
            is_main: m.is_main,
          })),
        });
      } else {
        reset({
          title: "",
          description: "",
          link: "",
          mediaEnabled: false,
          medias: [],
        });
      }
    }
  }, [isOpen, editMode, selectedProject, reset]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {editMode === "create"
              ? "Yeni Layihə Yarat"
              : "Layihəyə Düzəliş Et"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2"
                >
                  Başlıq
                </label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Layihənin başlığı"
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="link"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2"
                >
                  Link
                </label>
                <Input
                  id="link"
                  {...register("link")}
                  placeholder="https://example.com"
                />
                {errors.link && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.link.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2"
                >
                  Açıqlama
                </label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Layihə haqqında ətraflı məlumat"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Controller
                  name="mediaEnabled"
                  control={control}
                  render={({ field }) => (
                    <ToggleSwitch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                  Media əlavə et
                </span>
              </div>
              {mediaEnabled && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Şəkillər / Videolar
                  </label>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-neutral-50 rounded-lg shadow-sm"
                      >
                        <div className="flex-1">
                          <Controller
                            name={`medias.${index}.image`}
                            control={control}
                            render={({ field: controllerField }) => (
                              <FileUpload
                                id={`media-upload-${index}`}
                                onChange={(file) =>
                                  setValue(
                                    `medias.${index}.image`,
                                    file ?? undefined
                                  )
                                }
                                selectedFile={
                                  watch(`medias.${index}.image`) ?? null
                                }
                              />
                            )}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title={
                              watch(`medias.${index}.is_main`)
                                ? "Əsas media"
                                : "Əsas et"
                            }
                            className={`flex items-center justify-center w-16 h-8 rounded border transition-all duration-150 shadow-sm text-[11px]
                              ${
                                watch(`medias.${index}.is_main`)
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-400"
                              }
                              group`}
                            onClick={() => {
                              fields.forEach((_, i) => {
                                setValue(`medias.${i}.is_main`, i === index);
                              });
                            }}
                          >
                            <span className="hidden sm:inline font-medium w-full text-center">
                              {watch(`medias.${index}.is_main`)
                                ? "Əsas"
                                : "Seç"}
                            </span>
                            <span className="sm:hidden">
                              <svg
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="5"
                                  fill={
                                    watch(`medias.${index}.is_main`)
                                      ? "#fff"
                                      : "none"
                                  }
                                  strokeWidth="2"
                                />
                              </svg>
                            </span>
                          </button>

                          <button
                            type="button"
                            title="Sil"
                            onClick={() => remove(index)}
                            className="flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 shadow-sm group-hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Sil</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      append({ image: undefined, is_main: fields.length === 0 })
                    }
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Media əlavə et
                  </button>

                  {errors.medias && (
                    <p className="text-sm text-red-600 mt-2">
                      {typeof errors.medias === "string"
                        ? errors.medias
                        : errors.medias.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={onOpenChange}
                className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg sm:rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Ləğv Et
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-slate-900 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-slate-800 transition-colors text-sm disabled:bg-slate-500"
              >
                {isLoading ? "Yaddaşda saxlanılır..." : "Yadda Saxla"}
              </button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PortfolioFormModal;
