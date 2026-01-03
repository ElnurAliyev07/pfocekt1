import { notFound } from 'next/navigation';
import AcceptInvitation from './components/AcceptInvitation';
import { getProjectInvitationItemService } from '@/services/server/project.service';

interface pageProps {
   params: Promise<{ token: string }>
}

const page = async ({ params }: pageProps) => {
  const { token } = await params;
  try {
    const response = await getProjectInvitationItemService({token: token});
    return (
      <AcceptInvitation invitation={response.data} />
    );
  } catch {
    notFound()
  }
  
};

export default page;
