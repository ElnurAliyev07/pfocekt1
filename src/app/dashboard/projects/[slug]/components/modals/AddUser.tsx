"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import { Select, SelectItem } from "@/components/ui/form";
import Plus from "../../../../components/ui/icons/Plus";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ApiError } from "@/types/error.type";
import { showToast, ToastType } from "@/utils/toastUtils";
import Loading from "@/components/ui/icons/Loading";
import useProjectMemberStore from "@/store/projectMemberStore";
import { sendProjectInvitationService } from "@/services/client/project.service";
import useTaskStore from "@/store/taskStore";
import { Form } from "@/components/ui";
import useGeneralStore from "@/store/generalStore";

const AddUserModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(""); // Status için state tanımlandı
  const { memberShipStatuses } = useGeneralStore();
  const { projectMembers, fetchProjectMembers } = useProjectMemberStore();
  const { project } = useTaskStore();

  useEffect(() => {
    if (memberShipStatuses && memberShipStatuses.length > 0) {
      setStatus(memberShipStatuses[0].key || "");
    }
  }, [memberShipStatuses]);

  const handleClick = async () => {
    if (email && email.includes("@")) {
      try {
        setIsLoading(true);
        await sendProjectInvitationService({
          email: email,
          project: project?.id || 0,
          role: status,
        });
        setEmail("");
        setError("");
        setIsLoading(false);
        fetchProjectMembers(true);
        onOpenChange();
        showToast("Dəvət göndərildi", ToastType.SUCCESS);
      } catch (error) {
        const apiErrors = (error as ApiError).data;
        if (apiErrors && typeof apiErrors === "object") {
          if (apiErrors["non_field_errors"]) {
            setError("İstifadəçi mövcuddur və ya artıq dəvət göndərilib");
            showToast(
              "İstifadəçi mövcuddur və ya artıq dəvət göndərilib",
              ToastType.ERROR
            );
            setIsLoading(false);
          }
        }
      }
    } else {
      setError("Email daxil edin");
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="primary"
        className="w-full md:w-auto rounded-[8px] text-[14px] font-medium"
      >
        <Plus />
        <span>Üzv əlavə et</span>
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          <form>
            <ModalHeader className="flex flex-col gap-1">
              Üzv əlavə et
            </ModalHeader>
            <ModalBody>
              <div>
                <label className="font-medium text-t-black" htmlFor="email">
                  Email ilə dəvət et
                </label>
                <div className="mt-[8px] flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-2">
                  <div className="w-full overflow-x-auto custom-scrollbar-x border border-border-gray flex items-center gap-[8px] rounded-[8px] h-[48px]">
                    <input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={"Email adresi daxil edin"}
                      className="flex-1 w-full h-full border-0 focus:ring-0 focus:outline-hidden px-[16px]"
                      type="text"
                    />
                  </div>
                  <div className="flex w-full items-center gap-2">
                    {memberShipStatuses && memberShipStatuses.length > 0 && (
                      <Form.Select
                        placeholder="Status"
                        onValueChange={(e) => setStatus(e)}
                        value={status}
                        className="w-full h-[48px] mt-0!"
                      >
                        {memberShipStatuses.map((item) => (
                          <Form.SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </Form.SelectItem>
                        ))}
                      </Form.Select>
                    )}

                    <button
                      disabled={isLoading}
                      onClick={handleClick}
                      type="button"
                      className="whitespace-nowrap flex gap-[8px] justify-center place-items-center h-[48px] bg-primary px-[20px] rounded-[12px] min-w-[102px] text-white"
                    >
                      {isLoading ? <Loading /> : <span>Əlavə et</span>}
                    </button>
                  </div>

                 
                </div>
                <div className="mt-[5px] min-h-[10px]">
                    {error && <p className="text-custom-red">{error}</p>}
                  </div>
              </div>

              <div className="mt-[24] mb-[10px]">
                <div className="border-b border-border-gray pb-[6px]">
                  <span className="text-[14px] pb-[9px] border-b border-primary text-t-black font-medium">
                    Üzv sayı ({projectMembers.length})
                  </span>
                </div>
                <div className="mt-[24px] grid gap-[8px]">
                  {projectMembers.map(
                    (item, index) =>
                      item.user && (
                        <div
                          key={index}
                          className={`h-[60px] flex items-center justify-between p-[12px] group rounded-[8px]`}
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
                              <p className="text-t-gray text-[12px]">
                                {item.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="h-[32px] bg-[#E8EAED] px-[12px] rounded-[8px] grid place-items-center text-[14px] leading-[20px]">
                            {item.role.label}
                          </div>
                        </div>
                      )
                  )}
                  {projectMembers.length === 0 && (
                    <p className="text-center">Nəticə tapılmadı</p>
                  )}
                </div>
              </div>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUserModal;
