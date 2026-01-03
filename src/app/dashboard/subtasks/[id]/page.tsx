import { notFound } from 'next/navigation';
import React from 'react'
import { getSubtaskItemService } from '@/services/server/subtask.service';
import ClientPage from './ClientPage';

const page = async ({ params }: { params: Promise<{ id: number }> }) => {
    const { id } = await params;
    if (isNaN(id)) return notFound();

    try {
        const subtask = await getSubtaskItemService({ id });
        const previousSubtask = subtask.data.previous_subtasks.length > 0
            ? (await getSubtaskItemService({ id: subtask.data.previous_subtasks[0] })).data
            : undefined;
        
        return (
            <ClientPage subtaskProp={subtask.data} previousSubtaskProp={previousSubtask}/>
        );
    } catch {
        notFound();
    }
    return null;
}

export default page;