'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useWorkspaceStore from "@/store/workspaceStore";
import { WorkspaceCategory, WorkspaceStatus } from "@/types/workspace.type";
import { createWorkspaceService } from "@/services/client/workspace.service";
import { ApiError } from "@/types/error.type";
import Plus from "../../../components/ui/icons/Plus";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@/components/ui/modal";
import { Input, Select, SelectItem, Textarea } from "@/components/ui/form";
import Button from "@/components/ui/Button";
import { showToast, ToastType } from "@/utils/toastUtils";
import { useAppContext } from "@/providers/AppProvider";

// Define Zod schema
const schema = z.object({
    title: z.string({ required_error: "Başlıq tələb olunur" }).nonempty({ message: "Başlıq tələb olunur" }),
    // category: z.string({ required_error: "Kateqoriya tələb olunur" }).nonempty({ message: "Kateqoriya tələb olunur" }),
    status: z.string({ required_error: "Status tələb olunur" }).nonempty({ message: "Status tələb olunur" }),
    description: z.string()
});

type FormData = z.infer<typeof schema>;

interface Props {
    workspaceStatusList: WorkspaceStatus[],
    workspaceCategories: WorkspaceCategory[]
    children?: React.ReactNode,
    containerClassName?: string
}

const CreateWorkspaceModal: React.FC<Props> = ({ workspaceStatusList, workspaceCategories, children, containerClassName }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { fetchWorkspaces } = useWorkspaceStore();
    const { setIsLoading } = useAppContext()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        setValue,
        watch,
        control,
        clearErrors
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            // category: '',
            status: '',
            description: ''
        }
    });

    // Handle form submission
    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        try {
            const response = await createWorkspaceService({
                title: data.title,
                // category: Number(data.category),
                description: data.description,
                status: data.status,
            });
            await fetchWorkspaces(true);
            onOpenChange();
            reset();

        } catch (error) {
           const apiErrors = (error as ApiError).data;
           if (apiErrors && typeof apiErrors === "object") {
                Object.keys(apiErrors).forEach((field) => {
                    let errorMessage = apiErrors[field]?.[0];
                    if (errorMessage) {
                        if( field === 'title'){
                            errorMessage = 'Başlıq artıq mövcuddur. Başqa başlıq daxil edin.'
                            showToast(errorMessage, ToastType.ERROR)
                            setError("title", {
                                type: "manual",
                                message: errorMessage,
                            });
                        }else{
                           setError(field as keyof FormData, {
                            type: "manual",
                            message: errorMessage,
                        }); 
                        }
                        
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
    
    // Handle custom select changes since they're not directly compatible with react-hook-form
   

    // Reset form when modal closes
    const handleModalClose = () => {
        reset();
        onOpenChange();
    };

    return (
        <>  
            {
                children ? (
                    <button className={containerClassName} onClick={onOpen}>
                        {children}
                    </button>
                )
                : (
                    <Button onPress={onOpen} className="bg-primary rounded-[8px] flex h-[44px] items-center justify-center w-full text-white text-[14px] md:mt-0 font-medium">
                        <Plus />
                        <span className="leading-[20px]">Virtual ofis yarat</span>
                    </Button>
                )
            }
           
            <Modal
                isOpen={isOpen}
                onOpenChange={handleModalClose}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex flex-col gap-1 text-base md:text-lg">
                                Virtual ofis yarat
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-3 md:gap-4">
                                    {errors.root && (
                                        <div className="mb-3 md:mb-4 text-red-500 text-xs md:text-sm">
                                            {errors.root.message}
                                        </div>
                                    )}
                                    {/* Title Field */}
                                    <div className="w-full">
                                        <Input
                                            className="w-full text-sm md:text-base"
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
                                            className="w-full text-sm md:text-base"
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
                                            className="w-full text-sm md:text-base"
                                            label="Status"
                                            placeholder="Status seçin"
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
                                            className="w-full text-sm md:text-base"
                                            labelPlacement="outside"
                                            label="Açıqlama"
                                            placeholder="Açıqlama daxil edin"
                                            isInvalid={!!errors.description}
                                            errorMessage={errors.description?.message}
                                            {...register("description")}
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="grid grid-cols-2 gap-2 px-4 py-3 md:px-6 md:py-4">
                                <Button 
                                    className="bg-custom-gray text-t-black font-medium text-sm md:text-base" 
                                    variant="flat" 
                                    onPress={handleModalClose}
                                    type="button">
                                    Ləğv et
                                </Button>
                                <Button 
                                    className="bg-primary text-white font-medium text-sm md:text-base" 
                                    type="submit">
                                    Virtual ofis yarat
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default CreateWorkspaceModal