// components/modals/EditWorkspaceModal.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@/components/ui/modal";
import { Input, Select, SelectItem, Textarea } from "@/components/ui/form";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workspace, WorkspaceCategory, WorkspaceStatus } from "@/types/workspace.type";     
import useWorkspaceStore from "@/store/workspaceStore";
import { updateWorkspaceService } from "@/services/client/workspace.service";
import { ApiError } from "@/types/error.type";
import { showToast, ToastType } from "@/utils/toastUtils";
import { useAppContext } from "@/providers/AppProvider";

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceStatusList: WorkspaceStatus[],
    workspaceCategories: WorkspaceCategory[],
    workspace: Workspace
}

const schema = z.object({
    title: z.string({ required_error: "Başlıq tələb olunur" }).nonempty({ message: "Başlıq tələb olunur" }),
    // category: z.string({ required_error: "Kateqoriya tələb olunur" }).nonempty({ message: "Kateqoriya tələb olunur" }),
    status: z.string({ required_error: "Status tələb olunur" }).nonempty({ message: "Status tələb olunur" }),
    description: z.string()
});

type FormData = z.infer<typeof schema>;

const EditWorkspaceModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, workspaceStatusList, workspaceCategories, workspace }) => {

    const { fetchWorkspaces } = useWorkspaceStore();
    const { setIsLoading } = useAppContext()
     const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        clearErrors,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: workspace.title,
            // category: String(workspace.category.id) || "", 
            status: workspace.status.key || "", 
            description: workspace.description,
        },
    });

 

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        try {
            await updateWorkspaceService(workspace.slug, {
                title: data.title,
                // category: Number(data.category),
                description: data.description,
                status: data.status,
            });
            await fetchWorkspaces(true);
            onClose(); // Modal'ı kapat
        } catch (error) {
            const apiErrors = (error as ApiError)?.data;
            if (apiErrors && typeof apiErrors === "object") {
                Object.keys(apiErrors).forEach((field) => {
                    const errorMessage = apiErrors[field]?.[0];
                    if (errorMessage) {
                        if (field === "title") {
                            setError("title", {
                                type: "manual",
                                message: 'Başlıq artıq mövcuddur. Başqa başlıq daxil edin.',
                            });
                            showToast('Başlıq artıq mövcuddur. Başqa başlıq daxil edin.', ToastType.ERROR)
                        } else if (field === "status") {
                            setError("status", {
                                type: "manual",
                                message: errorMessage,
                            });
                        } else if (field === "description") {
                            setError("description", {
                                type: "manual",
                                message: errorMessage,
                            });
                        }
                        // setError(field as keyof FormData, {
                        //     type: "manual",
                        //     message: errorMessage,
                        // });
                    }
                });
            } else {
                setError("root", {
                    type: "manual",
                    message: "An unexpected error occurred. Please try again.",
                });
            }
        }finally {
            setIsLoading(false)
        }
    };


    return (
        <Modal placement="center" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className="flex flex-col gap-1 text-lg sm:text-xl">
                        Redaktə edin
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4 w-full">
                            {errors.root && (
                                <div className="mb-4 text-red-500 text-sm">{errors.root.message}</div>
                            )}
                            {/* Title Field */}
                            <div className="w-full">
                                <Input
                                    className="w-full"
                                    labelPlacement="outside"
                                    autoFocus
                                    label="Ad"
                                    placeholder="Ad daxil edin"
                                    isInvalid={!!errors.title}
                                    errorMessage={errors.title?.message}
                                    {...register("title")}
                                />
                            </div>
                            {/* Category Field */}
                            {/* <div className="w-full">
                                <Select
                                    className="w-full"
                                    label="Kateqoriya"
                                    placeholder="Kateqoriya seçin"
                                    name="category"
                                    value={watch("category") || ""}
                                    onValueChange={(e) => {
                                        setValue("category", Array.isArray(e) ? e[0] : e);
                                        clearErrors("category");
                                    }}
                                    isInvalid={!!errors.category}
                                    errorMessage={errors.category?.message}
                                >
                                    {workspaceCategories.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div> */}
                            {/* Status Field */}
                            <div className="w-full">
                                <Select
                                    className="w-full"
                                    label="Status"
                                    placeholder="Select a status"
                                    name="status"
                                    value={watch("status") || ""}
                                    onValueChange={(e) => {
                                        setValue("status", Array.isArray(e) ? e[0] : e);
                                        clearErrors("status");
                                    }}
                                    isInvalid={!!errors.status}
                                    errorMessage={errors.status?.message}
                                >
                                    {workspaceStatusList.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            {/* Description Field */}
                            <div className="w-full">
                                <Textarea
                                    className="w-full min-h-[100px]"
                                    labelPlacement="outside"
                                    label="Məlumat"
                                    placeholder="Məlumat daxil edin"
                                    isInvalid={!!errors.description}
                                    errorMessage={errors.description?.message}
                                    {...register("description")}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="grid grid-cols-2 gap-2 sm:gap-4">
                        <Button 
                            className="bg-custom-gray font-medium w-full" 
                            variant="flat" 
                            onPress={onClose}
                            type="button">
                            Ləğv et
                        </Button>
                        <Button 
                            className="bg-primary text-white font-medium w-full" 
                            type="submit">
                            Redaktə edin
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default EditWorkspaceModal;
