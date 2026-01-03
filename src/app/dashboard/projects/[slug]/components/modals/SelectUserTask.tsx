import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import Search from "../icons/Search";
import Image from "next/image";
import useProjectMemberStore from "@/store/projectMemberStore";
import Close from "../icons/Close";
import useTaskUserStore, { TaskUser } from "@/store/taskUserStore";
import { ProjectMember } from "@/types/project.type";

export default function SelectUserTaskModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { projectMembers } = useProjectMemberStore();
  const { selectedUsers, addUser } = useTaskUserStore();

  // Geçici seçim listesi için state
  const [tempSelectedUsers, setTempSelectedUsers] = useState<TaskUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentLastOrderValue, setCurrentLastOrderValue] = useState<number>(1);

  // Modal açıldığında global state'den verileri al
  useEffect(() => {
    if (isOpen) {
      setCurrentLastOrderValue(selectedUsers.length + 1);
    }
  }, [isOpen, selectedUsers]);

  // Kullanıcı seçimini toggle eden fonksiyon
  const handleClickUser = (user: ProjectMember) => {
    if (isTempSelected(user)) {
      setTempSelectedUsers((prev) =>
        prev.filter((u) => u.projectMember.id !== user.id)
      );
    } else {
      setTempSelectedUsers((prev) => [
        ...prev,
        {
          projectMember: user,
          order: currentLastOrderValue,
          files: [new File([], "")],
        },
      ]);
      setCurrentLastOrderValue(currentLastOrderValue + 1);
    }
  };

  // Geçici seçim kontrolü
  const isTempSelected = (user: ProjectMember) => {
    return tempSelectedUsers.some((u) => u.projectMember.id === user.id);
  };

  // Confirm işlemi: Global state'e ekleme
  const handleConfirm = () => {
    tempSelectedUsers.forEach((user) => {
      addUser(user);
      // }
    });

    setTempSelectedUsers([]); // Seçimleri sıfırla
    onOpenChange(); // Modal'ı kapat
  };

  const filteredMembers = projectMembers.filter((member) =>
    member.user?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {selectedUsers.length > 0 ? (
        <Button
          onClick={onOpen}
          variant="flat"
          className="bg-transparent flex items-center gap-[6px] !text-primary"
          type="button"
        >
          <span className="text-[20px]">+</span>
          <span className="text-[14px] font-[500] whitespace-nowrap">
            Əlavə et
          </span>
        </Button>
      ) : (
        <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          İstifadəçi əlavə et
        </button>
      )}

      <Modal
        className="select-user-task-modal"
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Üzv seçin</ModalHeader>
          <ModalBody className="pb-[28px]">
            <div>
              <p className="font-[500] text-t-black">Üzv seçin</p>
              <div className="mt-[8px] flex justify-between items-center gap-[22px]">
                {/* Search input */}
                {tempSelectedUsers.length > 0 ? (
                  <div className="flex-1  border border-border-gray overflow-x-auto flex items-center gap-[8px] rounded-[16px] h-[48px] px-[16px] custom-scrollbar-x">
                    {tempSelectedUsers.map((item, index) => (
                      <div
                        key={index}
                        className=" h-[32px] min-w-[180px] px-[8px] rounded-[8px] flex justify-between items-center gap-[8px] bg-[#E8EAED]"
                      >
                        <div className="flex items-center gap-[8px]">
                          <Image
                            className="w-[28px] h-[28px] rounded-full object-cover"
                            src={
                              item.projectMember.user.user_profile.image ||
                              "/grid.png"
                            }
                            width={500}
                            height={500}
                            alt="profile-image"
                          />
                          <h3 className="text-[12px] whitespace-nowrap font-[500] text-t-black leading-[20px]">
                            {item.projectMember.user.full_name}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleClickUser(item.projectMember)}
                        >
                          <Close size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 w-full border border-border-gray flex items-center gap-[8px] rounded-[16px] h-[48px] px-[16px]">
                    <Search />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Üzv axtarın"
                      className="flex-1 w-full border-0 focus:ring-0 focus:outline-none"
                      type="text"
                    />
                  </div>
                )}
                <button
                  onClick={handleConfirm}
                  className="bg-primary text-white h-[44px] px-[20px] rounded-[12px] whitespace-nowrap"
                >
                  Əlavə et
                </button>
              </div>
              <div className="mt-[20px] space-y-[20px] py-[24px] px-[13px] border border-border-gray rounded-[12px]">
                {tempSelectedUsers.length > 0 && (
                  <div className="border border-border-gray flex items-center gap-[8px] rounded-[16px] h-[48px] px-[16px]">
                    <Search />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Üzv axtarın"
                      className="flex-1 w-full border-0 focus:ring-0 focus:outline-none"
                      type="text"
                    />
                    <button onClick={() => setSearchTerm("")}>
                      <Close size={24} />
                    </button>
                  </div>
                )}
                <div className="grid gap-[8px]">
                  {filteredMembers.map((item, index) => (
                    <div
                      onClick={() => handleClickUser(item)}
                      key={index}
                      className={`${
                        isTempSelected(item) && "bg-[#f3f1f1]"
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
                          <h2 className="text-t-black leading-[20px] text-[14px] font-[500]">
                            {item.user.full_name}
                          </h2>
                          <p className="text-t-gray text-[12px]">
                            {item.user.email}
                          </p>
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
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
