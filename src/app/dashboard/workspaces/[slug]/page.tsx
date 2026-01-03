import { getWorkspaceItemService } from '@/services/server/workspace.service';
import { notFound } from 'next/navigation';
import React from 'react';
import ClientPage from './ClientPage';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  // params bir Promise olarak geliyorsa, burada await kullanmalısınız
  const { slug } = await params;
  try {
    const workspace = await getWorkspaceItemService({ slug });
    return (
      <ClientPage workspace={workspace.data} slug={slug} />
    );
  } catch {
    notFound()
  }


};

export default page;
