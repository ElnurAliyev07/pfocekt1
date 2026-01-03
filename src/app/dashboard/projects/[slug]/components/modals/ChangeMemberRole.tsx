import { updateProjectMemberRoleService } from "@/services/client/project.service";
import useProjectMemberStore from "@/store/projectMemberStore";
import { KeyLabel } from "@/types/keyLabel.type";
import { ProjectMember } from "@/types/project.type";
import { Modal, ModalContent, ModalBody } from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useAppContext } from "@/providers/AppProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  member: ProjectMember;
}

const ChangeMemberRoleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  member,
}) => {
  const { memberShipStatuses } = useAppContext();
  const [selectedStatus, setSelectedStatus] = useState<KeyLabel>();
  const { fetchProjectMembers } = useProjectMemberStore();

  useEffect(() => {
    setSelectedStatus(
      memberShipStatuses.find((item) => item.key === member.role.key)
    );
  }, [member.role.key, memberShipStatuses]);

  const handleConfirm = async () => {
    if (selectedStatus) {
      await updateProjectMemberRoleService(member.id, {
        role: selectedStatus?.key,
      });
      fetchProjectMembers(true);
      onClose();
    }
  };

  return (
    <Modal size="xs" isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        <ModalBody className="px-[8px] py-[20px]">
          <div className="space-y-[2px]">
            {memberShipStatuses.map((item, index) => (
              <div key={index}>
                <div
                  onClick={() => setSelectedStatus(item)}
                  className="cursor-pointer rounded-[4px] flex hover:bg-[#F7F6FF] justify-between group items-center py-[10px] px-[12px] gap-2"
                >
                  <div className="text-[14px] text-t-black leading-[20px]">
                    {item.label}
                  </div>
                  <div
                    className={`${
                      selectedStatus?.key === item.key
                        ? "bg-primary border-primary"
                        : ""
                    } w-[24px] h-[24px] rounded-full border border-[#B8BABD] group-hover:border-primary group-hover:bg-primary grid place-items-center`}
                  >
                    <div
                      className={`${
                        selectedStatus?.key === item.key ? "bg-[#E5E5EA]" : ""
                      }  w-[10px] h-[10px] rounded-full group-hover:bg-[#E5E5EA]`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-[16px]">
            <Button
              onPress={onClose}
              variant="flat"
              className="mt-[16px] font-medium  text-[16px] leading-[24px]"
            >
              Bağla
            </Button>
            <Button
              onPress={handleConfirm}
              variant="primary"
              className="mt-[16px] font-medium text-[16px] leading-[24px]"
            >
              Təsdiqlə
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeMemberRoleModal;
