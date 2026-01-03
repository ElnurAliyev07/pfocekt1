import { getWorkspaceInvitationItemService } from '@/services/server/workspace.service';
import { notFound } from 'next/navigation';
import AcceptInvitation from './components/AcceptInvitation';

interface pageProps {
   params: Promise<{ token: string }>
}

const page = async ({ params }: pageProps) => {
  const { token } = await params;
  try {
    const response = await getWorkspaceInvitationItemService({token: token});
    return (
      <AcceptInvitation invitation={response.data} />
    );
  } catch {
    notFound()
  }
  
};

export default page;
