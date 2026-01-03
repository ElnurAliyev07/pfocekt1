'use client'

import { Modal, Button, Form } from "@/components/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Plus from "../../../../components/ui/icons/Plus";
import useProjectStore from "@/store/projectStore";
import { createProjectService } from "@/services/client/project.service";
import { ApiError } from "@/types/error.type";
import { useState } from "react";
import { useAppContext } from "@/providers/AppProvider";
// Define Zod schema
const schema = z.object({
    title: z.string({ required_error: "Başlıq tələb olunur" }).nonempty({ message: "Başlıq tələb olunur" }),
    description: z.string(),
});

type FormData = z.infer<typeof schema>;

interface Props {
    children?: React.ReactNode;
    containerClassName?: string;
    isOpen?: boolean;
    onOpenChange?: () => void;
    hiddenButton?: boolean
}

const CreateProjectModal = ({ children, containerClassName, isOpen: controlledIsOpen, onOpenChange, hiddenButton= false }: Props) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = (value: boolean) => {
        if (controlledIsOpen === undefined) {
            setInternalIsOpen(value);
        }
        if (onOpenChange) {
            onOpenChange();
        }
    };
    
    const { fetchProjects, workspaceSlug, fetchWorkspace } = useProjectStore();
    const { setIsLoading } = useAppContext()
    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    // Handle form submission
    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true)
            await createProjectService({
                title: data.title,
                description: data.description,
                workspace: workspaceSlug
            });
            await fetchProjects(true);
            await fetchWorkspace();
            setIsOpen(false);
            reset();
        } catch (error) {
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
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <>
            {children  ? (
                <button className={containerClassName} onClick={() => setIsOpen(true)}>
                    {children}
                </button>
            ) : (hiddenButton) ? '' : (

                <Button onPress={() => setIsOpen(true)} className="bg-primary !rounded-[8px] h-[44px] md:rounded-[48px] text-white text-[14px] font-medium leading-[20px]">
                    <Plus />
                    <span>Proyekt yarat</span>
                </Button>
            )}
            <Modal.Modal
                isOpen={isOpen}
                onOpenChange={() => setIsOpen(false)}
                placement="center"
            >
                <Modal.ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Modal.ModalHeader>Proyekt yarat</Modal.ModalHeader>
                        <Modal.ModalBody>
                            <div className="flex flex-col gap-4">
                                {errors.root && (
                                    <div className="mb-4 text-red-500 text-sm">{errors.root.message}</div>
                                )}
                                {/* Title Field */}
                                <div>
                                    <Form.Input
                                        labelPlacement="outside"
                                        label="Ad"
                                        placeholder="Ad daxil edin"
                                        {...register("title")}
                                        isInvalid={!!errors.title}
                                        errorMessage={errors.title?.message}
                                    />
                                </div>
                                {/* Description Field */}
                                <div>
                                    <Form.Textarea
                                        labelPlacement="outside"
                                        label="Məlumat"
                                        placeholder="Məlumat daxil edin"
                                        {...register("description")}
                                        isInvalid={!!errors.description}
                                        errorMessage={errors.description?.message}
                                    />
                                </div>
                            </div>
                        </Modal.ModalBody>
                        <Modal.ModalFooter className="grid grid-cols-2 gap-[8px]">
                            <Button className="bg-custom-gray font-medium" variant="flat" onPress={() => setIsOpen(false)}>
                                Ləğv et
                            </Button>
                            <Button className="bg-primary text-white font-medium" type="submit">
                                Proyekt yarat
                            </Button>
                        </Modal.ModalFooter>
                    </form>
                </Modal.ModalContent>
            </Modal.Modal>
        </>
    );
}

export default CreateProjectModal;