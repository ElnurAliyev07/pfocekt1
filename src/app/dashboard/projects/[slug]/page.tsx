import { notFound } from 'next/navigation';
import React from 'react'
import { getProjectItemService } from '@/services/server/project.service';
import ClientPage from './ClientPage';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    // params bir Promise olarak geliyorsa, burada await kullanmalısınız
    const { slug } = await params;
    try {
    const project = await getProjectItemService({ slug });

      return (
         <ClientPage project={project.data} slug={slug}/>
      );
    } catch {
      notFound();
    }
  
  
  };
  
  export default page;
  