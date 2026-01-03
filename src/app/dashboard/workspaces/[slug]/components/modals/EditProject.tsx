// components/modals/EditProjectModal.tsx
import { Modal, Button, Form } from "@/components/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/types/error.type";
import { Project } from "@/types/project.type";
import { updateProjectService } from "@/services/client/project.service";
import useProjectStore from "@/store/projectStore";

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project
}

const schema = z.object({
    title: z.string({ required_error: "Başlıq tələb olunur" }).nonempty({ message: "Başlıq tələb olunur" }),
    description: z.string(),
});

type FormData = z.infer<typeof schema>;

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project }) => {

    const { fetchProjects, workspaceSlug } = useProjectStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: project.title,
            description: project.description,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await updateProjectService(project.slug, {
                title: data.title,
                description: data.description,
                workspace: workspaceSlug
            });
            console.log("Workspace updated successfully:", response);
            await fetchProjects(true);
            onClose();
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
        }
    };


    return (
        <Modal.Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <Modal.ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.ModalHeader className="flex flex-col gap-1">Redaktə edin</Modal.ModalHeader>
                    <Modal.ModalBody>
                        <div className="flex flex-col gap-4">
                            {errors.root && (
                                <div className="mb-4 text-red-500 text-sm">{errors.root.message}</div>
                            )}
                            {/* Title Field */}
                            <div>
                                <Form.Input
                                    labelPlacement="outside"
                                    autoFocus
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
                        <Button className="bg-custom-gray font-medium" variant="flat" onPress={onClose}>
                            Ləğv et
                        </Button>
                        <Button className="bg-primary text-white font-medium" type="submit">
                            Redaktə edin
                        </Button>
                    </Modal.ModalFooter>
                </form>
            </Modal.ModalContent>
        </Modal.Modal>
    );
};

export default EditProjectModal;
