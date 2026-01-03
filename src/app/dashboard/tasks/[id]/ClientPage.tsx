
"use client";

import React, { useEffect } from 'react'
import Header from "./components/containers/Header";
import Chat from "./components/containers/Chat";
import Detail from "./components/containers/Detail";
import { Task, TaskStatus } from '@/types/task.type';
import useTaskItemStore from '@/store/taskItemStore';
import InitializerWrapper from '@/components/common/wrappers/InitializerWrapper';

const ClientPage = ( { task }: { task: Task } ) => {
    const { setTask, setCurrentStatus, currentStatus, isEditing, setIsJointPost } = useTaskItemStore();
    useEffect(() => {
        setTask(task);
        setCurrentStatus(task.status);
        setIsJointPost(task.post?.joint_post || false);
    }, [task]); 

    useEffect(() => {
      const allowedStatuses: TaskStatus["key"][] = [
        "in_progress",
        "must_be_done",
        "must_be_done_again",
      ];
  
      if (
        (!currentStatus || 
        !allowedStatuses.includes(currentStatus.key) ) && !isEditing
      ) {
        return;
      }
  
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = ""; // bazı tarayıcılar için gerekli
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [currentStatus, isEditing]); // her değiştiğinde kontrol edilmeli
  return (
    <>
    <Header  />
   
      <InitializerWrapper >
        <Detail />
      </InitializerWrapper>
    
    <Chat />
    </>
  )
}

export default ClientPage