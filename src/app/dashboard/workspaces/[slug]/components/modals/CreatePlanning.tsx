import Plus from '@/app/dashboard/components/ui/icons/Plus';
import { createPlanningService } from '@/services/client/planning.service';
import useProjectStore from '@/store/projectStore';
import useWorkspaceMemberStore from '@/store/workspaceMemberStore';
import { CreatePlanning } from '@/types/planning.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure 
} from "@/components/ui/modal";
import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import SelectProject from '../inputs/SelectProject';
import SelectControler from '../inputs/SelectController';
import { User } from '@/types/auth.type';
import usePlanningStore from '@/store/planningStore';
import { ApiError } from '@/types/error.type';
import { useAppContext } from '@/providers/AppProvider';

const schema = z.object({
  project: z.number({
    required_error: "Proyekt seçin",
    invalid_type_error: "Geçersiz değer",
  }).nonnegative({ message: "Proyekt negatif olamaz" }),
  
  controller: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpenProps?: boolean;
  hiddenButton?: boolean;
  onCloseProps?: (data: boolean) => void;
}

const CreatePlanningModal: React.FC<Props> = ({isOpenProps = false, hiddenButton = false, onCloseProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { projects } = useProjectStore();
  const { workspaceMembers } = useWorkspaceMemberStore();
  const { fetchPlannings, plannings } = usePlanningStore();
  const { setIsLoading } = useAppContext();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  // Mevcut planlamaları olan projeleri filtrele
  const availableProjects = useMemo(() => {
    const planningProjectIds = plannings.map(planning => planning.project.id);
    return projects.filter(project => !planningProjectIds.includes(project.id));
  }, [projects, plannings]);

  const onOpenChange = () => {
    if (isOpen) {
      onClose();
      onCloseProps?.(false);
    } else {
      onOpen();
    }
  };
  
  useEffect(() => {
    if (isOpenProps) {
      onOpen();
    } else {
      onClose();
    }
  }, [isOpenProps]);

  const handleConfirm = async (data: FormData) => {
    setIsLoading(true);
    try {
      const payload: CreatePlanning = {
        project: data.project,
        controller: data.controller,
      };

      await createPlanningService(payload);
      reset();
      fetchPlannings();
      onOpenChange();
      onCloseProps?.(true);
    } catch (error) {
      console.log(error);
      const apiErrors = (error as ApiError).data;
      if (apiErrors && typeof apiErrors === "object") {
        Object.keys(apiErrors).forEach((field) => {
          const errorMessage = apiErrors[field]?.[0];
          if (errorMessage) {
            setError(field as keyof FormData, {
              type: "manual",
              message: errorMessage,
            });
          }
        });
      } else {
        setError("root", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <>  
      {!hiddenButton && (
        <Button
          variant="primary"
          onClick={() => {
            onOpen();
          }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center gap-2">
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            <span className="font-medium">Planlama əlavə et</span>
          </div>
        </Button>
      )}
      
      <Modal 
        className='w-[95%] md:w-[90%] lg:w-[500px]' 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        placement="center"
      >
        <ModalContent className='py-3 px-4 md:py-4 md:px-5 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/30'>
          <form className='flex flex-col' onSubmit={handleSubmit(handleConfirm)}>
            <ModalHeader className='p-0'>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Planlama əlavə et
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Yeni planlama yaradın və idarə edin
                </p>
              </div>
            </ModalHeader>
            <ModalBody className='p-0 mt-3'>
              <div className="flex w-full flex-col">
                <div className='flex flex-col gap-3 w-full'>
                  {errors.root && (
                    <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-red-500 text-xs font-medium">{errors.root.message}</p>
                    </div>
                  )}
                  {/* Planning Select */}
                  <div className="flex flex-col gap-3">
                    <div className="w-full">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Proyekt seçin
                      </label>
                      <Controller
                        name="project"
                        control={control}
                        render={({ field }) => (
                          <SelectProject
                            placeholder="Seç"
                            onSelect={(e) => (field.onChange(e?.id))}
                            options={availableProjects}
                            aria-label="Müştəri seç"
                          />
                        )}
                      />
                      {errors.project && (
                        <p className="mt-1 text-red-500 text-xs font-medium">{errors.project.message}</p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Nəzarətçi seçin
                      </label>
                      <Controller
                        name="controller"
                        control={control}
                        render={({ field }) => (
                          <SelectControler
                            onSelect={(e) => field.onChange(e?.id)}
                            options={workspaceMembers
                              .map((member) => member.user)
                              .filter((user): user is User => user !== null && user !== undefined)
                            }
                            placeholder="Seç"
                          />
                        )}
                      />
                      {errors.controller && (
                        <p className="mt-1 text-red-500 text-xs font-medium">{errors.controller.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="!p-0 !pt-4 flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="flat"
                className="w-full sm:w-[140px] h-9 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                onClick={() => {
                  onOpenChange();
                  onCloseProps?.(false);
                }}
              >
                Ləğv et
              </Button>
              <Button 
                variant="primary" 
                className='w-full sm:w-[140px] h-9 rounded-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300' 
                type="submit"
              >
                Əlavə et
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePlanningModal; 