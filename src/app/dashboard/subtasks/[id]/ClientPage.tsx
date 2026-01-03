"use client";

import React, { useEffect } from 'react'
import Header from "./components/containers/Header";
import Detail from "./components/containers/Detail";
import { SubTask, SubtaskStatus } from '@/types/subtask.type';
import useSubtaskItemStore from '@/store/subtaskItemStore';
import InitializerWrapper from '@/components/common/wrappers/InitializerWrapper';

const ClientPage = ( { subtaskProp, previousSubtaskProp }: { subtaskProp: SubTask, previousSubtaskProp?: SubTask } ) => {
    const { setSubtask, subtask, previousSubtask, setCurrentStatus, currentStatus, isEditing, setPreviousSubtask } = useSubtaskItemStore();
    
    useEffect(() => {
        setSubtask(subtaskProp);
        setCurrentStatus(subtaskProp.subtask_status);
        if (previousSubtaskProp) {
            setPreviousSubtask(previousSubtaskProp);
        }
    }, [subtaskProp, previousSubtaskProp]); 

    useEffect(() => {
      const allowedStatuses: SubtaskStatus["status"][] = [
        "in_progress",
        "must_be_done",
        "must_be_done_again",
      ];
  
      if (
        (!currentStatus || 
        !allowedStatuses.includes(currentStatus.status) ) && !isEditing
      ) {
        return;
      }
  
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = "";
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [currentStatus, isEditing]);

    return (
        <InitializerWrapper isLoading={!subtask}>
            {subtask && (
                <>
                    <Header />
                    <Detail subtask={subtask}/>
                </>
            )}
        </InitializerWrapper>
    )
}

export default ClientPage