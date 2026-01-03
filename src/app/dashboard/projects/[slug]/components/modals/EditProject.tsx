// components/modals/EditProjectModal.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/form";
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
    title: z.string().nonempty("Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
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
            onClose(); // Modal'ı kapat
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
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>Redaktə edin</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4">
                            {errors.root && (
                                <div className="mb-4 text-red-500 text-sm">{errors.root.message}</div>
                            )}
                            {/* Title Field */}
                            <div>
                                <Input
                                    label="Title"
                                    placeholder="Enter a title"
                                    autoFocus
                                    {...register("title")}
                                    isInvalid={!!errors.title}
                                    errorMessage={errors.title?.message}
                                />
                            </div>
                           
                            {/* Description Field */}
                            <div>
                                <Textarea
                                    label="Description"
                                    placeholder="Enter a description"
                                    {...register("description")}
                                    isInvalid={!!errors.description}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="grid grid-cols-2">
                        <Button variant="flat" onPress={onClose}>
                            Ləğv et
                        </Button>
                        <Button variant="primary" type="submit">
                            Redaktə edin
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default EditProjectModal;
