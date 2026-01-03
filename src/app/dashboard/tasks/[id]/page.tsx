import { getTaskItemService } from "@/services/server/task.service";
import { notFound } from "next/navigation";
import React from "react";
import ClientPage from "./ClientPage";

const page = async ({ params }: { params: Promise<{ id: number }> }) => {
  // params bir Promise olarak geliyorsa, burada await kullanmalısınız
  const { id } = await params;

  try {
    const task = await getTaskItemService({ id });
    return (
      <>
        <ClientPage task={task.data}/>
      </>
    );
  } catch {
    notFound();
  }

  return <div>{id}</div>;
};

export default page;
