import { getWorkspaceInvitationItemService } from '@/services/server/workspace.service';
import InvantionCard from './InvantionCard';
import { notFound } from 'next/navigation';

interface AcceptInvitationProps {
   params: Promise<{ token: string }>
}

const AcceptInvitation = async ({ params }: AcceptInvitationProps) => {
  const { token } = await params;
  try {
    const response = await getWorkspaceInvitationItemService({token: token});
    return (
      <InvantionCard invitation={response.data} />
    );
  } catch {
    notFound()
  }
  
};

export default AcceptInvitation;
