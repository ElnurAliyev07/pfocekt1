import React from "react";
import Modal from "@/components/ui/modal/Modal";
import Button from "@/components/ui/Button";

interface Props {
  startTaskModal: boolean;
  setStartTaskModal: (value: boolean) => void;
  completeTaskModal: boolean;
  setCompleteTaskModal: (value: boolean) => void;
  acceptTaskModal: boolean;
  setAcceptTaskModal: (value: boolean) => void;
  rejectTaskModal: boolean;
  setRejectTaskModal: (value: boolean) => void;
  cancelTaskModal: boolean;
  setCancelTaskModal: (value: boolean) => void;
  sendToClientModal: boolean;
  setSendToClientModal: (value: boolean) => void;
  handleStartTask: () => void;
  handleComplete: () => void;
  handleAcceptTask: () => void;
  handleCancelTask: () => void;
  isLoading: boolean;
}

const TaskModals: React.FC<Props> = ({
  startTaskModal,
  setStartTaskModal,
  completeTaskModal,
  setCompleteTaskModal,
  acceptTaskModal,
  setAcceptTaskModal,
  rejectTaskModal,
  setRejectTaskModal,
  cancelTaskModal,
  setCancelTaskModal,
  sendToClientModal,
  setSendToClientModal,
  handleStartTask,
  handleComplete,
  handleAcceptTask,
  handleCancelTask,
  isLoading,
}) => {
  return (
    <>
      <Modal
        isOpen={startTaskModal}
        onOpenChange={() => setStartTaskModal(false)}
        title="Tapşırığı başlat"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Tapşırığı başlatmaq istədiyinizə əminsiniz?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onPress={() => setStartTaskModal(false)}
              variant="flat"
              size="sm"
            >
              Ləğv et
            </Button>
            <Button
              onPress={handleStartTask}
              variant="primary"
              size="sm"
              isLoading={isLoading}
            >
              Başlat
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={completeTaskModal}
        onOpenChange={() => setCompleteTaskModal(false)}
        title="Tapşırığı tamamla"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Tapşırığı tamamlamaq istədiyinizə əminsiniz?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onPress={() => setCompleteTaskModal(false)}
              variant="flat"
              size="sm"
            >
              Ləğv et
            </Button>
            <Button
              onPress={handleComplete}
              variant="primary"
              size="sm"
              isLoading={isLoading}
            >
              Tamamla
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={acceptTaskModal}
        onOpenChange={() => setAcceptTaskModal(false)}
        title="Tapşırığı təsdiq et"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Tapşırığı təsdiq etmək istədiyinizə əminsiniz?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onPress={() => setAcceptTaskModal(false)}
              variant="flat"
              size="sm"
            >
              Ləğv et
            </Button>
            <Button
              onPress={handleAcceptTask}
              variant="primary"
              size="sm"
              isLoading={isLoading}
            >
              Təsdiq et
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={rejectTaskModal}
        onOpenChange={() => setRejectTaskModal(false)}
        title="Tapşırığı təsdiq etmə"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Tapşırığı təsdiq etməmək istədiyinizə əminsiniz?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onPress={() => setRejectTaskModal(false)}
              variant="flat"
              size="sm"
            >
              Ləğv et
            </Button>
            <Button
              onPress={() => {
                /* TODO: Implement handleRejectTask */
                setRejectTaskModal(false);
              }}
              variant="danger"
              size="sm"
            >
              Təsdiq etmə
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={cancelTaskModal}
        onOpenChange={() => setCancelTaskModal(false)}
        title="Tapşırığı ləğv et"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Tapşırığı ləğv etmək istədiyinizə əminsiniz?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onPress={() => setCancelTaskModal(false)}
              variant="flat"
              size="sm"
            >
              Ləğv et
            </Button>
            <Button
              onPress={handleCancelTask}
              variant="danger"
              size="sm"
              isLoading={isLoading}
            >
              Ləğv et
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={sendToClientModal}
        onOpenChange={() => setSendToClientModal(false)}
        title="Müştəriyə göndər"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Tapşırığı müştəriyə göndərmək istədiyinizə əminsiniz?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onPress={() => setSendToClientModal(false)}
              variant="flat"
              size="sm"
            >
              Ləğv et
            </Button>
            <Button
              onPress={() => {
                /* TODO: Implement handleSendToClient */
                setSendToClientModal(false);
              }}
              variant="primary"
              size="sm"
            >
              Göndər
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskModals; 