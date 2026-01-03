import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "@/components/ui";
import Image from "next/image";
import Close from "@/app/dashboard/projects/[slug]/components/icons/Close";
import Search from "@/app/dashboard/files/components/ui/icons/Search";
import useWorkspaceMemberStore from "@/store/workspaceMemberStore";
import { Post, PostUser } from "@/types/planningStore.type";
import { User } from "@/types/auth.type";
import Time from "@/components/ui/icons/Time";
import usePlanningStore from "@/store/planningStore";
import { useAppContext } from "@/providers/AppProvider";

interface Props {
    post: Post;
}
 const  AddPlanningPostUserModal: React.FC<Props> = ({ post }) => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpenChange = () => setIsOpen(!isOpen);
    const onOpen = () => setIsOpen(true);
    
    const { workspaceMembers } = useWorkspaceMemberStore();
    const { updatePostUsers } = usePlanningStore();

    // Geçici seçim listesi için state
    const [tempSelectedUsers, setTempSelectedUsers] = useState<PostUser[]>([]);
    const [tempSelectedUser, setTempSelectedUser] = useState<PostUser | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { professions } = useAppContext();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setTempSelectedUsers(post.users)
    }, [post.users])


    // Modal açıldığında global state'den verileri al

    const handleConfirm = () => {
        setErrorMessage(null);
        setTempSelectedUsers([]);
        setTempSelectedUser(null);
        updatePostUsers(post.id, tempSelectedUsers);
        onOpenChange();
    };

    // Kullanıcı seçimini toggle eden fonksiyon
    const handleClickUser = (user: PostUser) => {
        if (isTempSelected(user)) {
            setTempSelectedUsers((prev) => prev.filter((u) => u.user.id !== user.user.id));
            setTempSelectedUser(null);
        } else if (user.user) {
            setTempSelectedUsers((prev) => [...prev, { 
                user: user.user as User, 
                minute: user.minute, 
                profession: user.profession 
            }]);
            setTempSelectedUser(user);
        }
    };


    // Geçici seçim kontrolü
    const isTempSelected = (user: PostUser) => {
        return tempSelectedUsers.some((u) => u.user.id === user.user.id);
    };

    // Confirm işlemi: Global state'e ekleme

    const handleUpdateProfession = (userId: number, newProfession: number) => {
        setTempSelectedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.user.id === userId ? { ...user, profession: newProfession } : user
            )
        );

        if (tempSelectedUser && tempSelectedUser.user.id === userId) {
            setTempSelectedUser({ ...tempSelectedUser, profession: newProfession });
        }
    };

    const handleUpdateMinute = (userId: number, newMinute: number) => {
        setTempSelectedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.user.id === userId ? { ...user, minute: newMinute } : user
            )
        );

        if (tempSelectedUser && tempSelectedUser.user.id === userId) {
            setTempSelectedUser({ ...tempSelectedUser, minute: newMinute });
        }
    };

  


    const filteredMembers = workspaceMembers.filter(
        (member) => member.user && member.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Button 
                variant="flat" 
                onPress={onOpen} 
                className="flex items-center gap-1 !text-primary !bg-transparent hover:!bg-primary/5 rounded-md px-2  transition-all duration-200" 
                type="button"
                size="sm"
            >
                <span className="text-sm">+</span>
                <span className="text-xs font-medium whitespace-nowrap">Əlavə et</span>
            </Button>
            <Modal.Modal className=".select-user-task-modal" size="lg" isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <Modal.ModalContent>
                    <Modal.ModalHeader>Üzv Əlavə Et</Modal.ModalHeader>
                    <Modal.ModalBody className="pb-[28px]">
                        <div>
                            <p className="font-medium text-t-black">Üzv seçin</p>
                            <div className="mt-[8px] flex-1 w-full border border-border-gray flex items-center gap-[8px] rounded-[16px] h-[48px] px-[16px]">
                                <Search />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setTempSelectedUser(null);
                                    }
                                    }
                                    onFocus={() => setTempSelectedUser(null)}
                                    placeholder="Üzv axtarın"
                                    className="flex-1 w-full border-0 focus:ring-0 focus:outline-hidden"
                                    type="text"
                                />
                            </div>
                            {tempSelectedUsers.length > 0 && (
                                <div className="mt-[8px] flex-1  border border-border-gray overflow-x-auto flex items-center gap-[8px] rounded-[16px] h-[48px] px-[16px]">
                                    {tempSelectedUsers.map((item, index) => item.user && (
                                        <div key={index} className={`${tempSelectedUser?.user.id === item.user.id ? 'bg-[#deebff]' : 'bg-[#E8EAED]'} hover:bg-[#deebff] cursor-pointer h-[32px] min-w-[180px] px-[8px] rounded-[8px] flex justify-between items-center gap-[8px]`}>
                                            <div onClick={() => setTempSelectedUser(item)} className="flex items-center gap-[8px]">
                                                <Image
                                                    className="w-[28px] h-[28px] rounded-full object-cover"
                                                    src={item.user.user_profile.image || "/grid.png"}
                                                    width={500}
                                                    height={500}
                                                    alt="profile-image"
                                                />
                                                <h3 className="text-[12px] whitespace-nowrap font-medium text-t-black leading-[20px]">
                                                    {item.user.full_name}
                                                </h3>
                                            </div>
                                            <button onClick={() => {
                                                handleClickUser(item);
                                                setTempSelectedUser(null);
                                            }}>
                                                <Close size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                            }
                            {errorMessage && (
                                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                            )}
                            
                            {
                                tempSelectedUsers.map((item, index) => item.user.id === tempSelectedUser?.user.id && (
                                    <div key={index} className="mt-[20px] bg-[#F6F6F6] py-[20px] px-[24px] rounded-[8px]">
                                        <h2 className="text-[#64717C] text-[14px] font-medium leading-[20px]">{item.user.full_name}</h2>
                                        <div className="mt-[20px]">
                                            <label className="text-[14px] text-t-black font-medium leading-[20px]">İxtisas</label>
                                            <Form.Select
                                                placeholder="İxtisas seçin"
                                                value={item.profession ? String(item.profession): undefined}
                                                resetable={true}
                                                onValueChange={(e) => {
                                                    if (tempSelectedUser) {
                                                        handleUpdateProfession(item.user.id, Number(e));
                                                    }
                                                }}
                                                className="bg-white rounded-[8px] h-[48px] border border-[#E8EAED]"
                                            >
                                                {professions.map((item) => (
                                                    <Form.SelectItem key={item.id} value={String(item.id)}>
                                                        {item.title}
                                                    </Form.SelectItem>
                                                ))}
                                            </Form.Select>
                                        </div>
                                        <div className="mt-[12px]">
                                            <label className="block text-[14px] text-t-black font-medium leading-[20px]">Vaxt(dəqiqə)</label>
                                            <div className="mt-[8px] h-[48px] w-full p-[14px] bg-white rounded-[8px] border border-custom-gray flex items-center justify-between gap-1">
                                                <input 
                                                    className="flex-1 focus:ring-0 focus:outline-hidden" 
                                                    type="number" 
                                                    onChange={(e) => handleUpdateMinute(item.user.id, Number(e.target.value))} 
                                                    value={tempSelectedUser.minute || ''} 
                                                    placeholder="Vaxt" 
                                                />
                                                <Time />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                !tempSelectedUser &&
                                <div className="mt-[20px] space-y-[20px] py-[24px] px-[13px] border border-border-gray rounded-[12px]">
                                    <div className="grid gap-[8px]">
                                        {filteredMembers.map((item, index) => item.user && (

                                            <div
                                                onClick={() => {
                                                    if (item.user) {
                                                        handleClickUser({ user: item.user, minute: null, profession: null });
                                                    }
                                                }}
                                                key={index}
                                                className={`${isTempSelected({ user: item.user, minute: null, profession: null }) && "bg-[#f3f1f1]"
                                                    } h-[60px] flex items-center justify-between p-[12px] group hover:bg-[#E8EAED] rounded-[8px]`}
                                            >
                                                <div className="flex items-center gap-[12px]">
                                                    <Image
                                                        className="w-[36px] h-[36px] rounded-full object-cover"
                                                        src={item.user.user_profile.image || "/grid.png"}
                                                        width={500}
                                                        height={500}
                                                        alt="profile-image"
                                                    />
                                                    <div>
                                                        <h2 className="text-t-black leading-[20px] text-[14px] font-medium">
                                                            {item.user.full_name}
                                                        </h2>
                                                        <p className="text-t-gray text-[12px]">{item.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="h-[32px] bg-[#E8EAED] group-hover:bg-[#c3c4c7] px-[12px] rounded-[8px] grid place-items-center text-[14px] leading-[20px]">
                                                    {item.role.label}
                                                </div>
                                            </div>
                                        ))}
                                        {filteredMembers.length === 0 && (
                                            <p className="text-center">Nəticə tapılmadı</p>
                                        )}
                                    </div>
                                </div>
                            }

                        </div>
                    </Modal.ModalBody>
                    <Modal.ModalFooter>
                        <div className="flex justify-end w-full gap-1.5">
                            <Button 
                                variant="flat" 
                                onPress={onOpenChange} 
                                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-200"
                            >
                                Bağla
                            </Button>
                            <Button 
                                variant="primary" 
                                onPress={handleConfirm} 
                                className="px-3 py-1 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-all duration-200"
                            >
                                Əlavə et
                            </Button>
                        </div>
                    </Modal.ModalFooter>
                </Modal.ModalContent>
            </Modal.Modal>
        </>
    );
}

export default AddPlanningPostUserModal;