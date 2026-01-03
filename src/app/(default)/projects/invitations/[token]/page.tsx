import InvantionCard from './InvantionCard';
import { notFound } from 'next/navigation';
import { getProjectInvitationItemService } from '@/services/server/project.service';

interface AcceptInvitationProps {
   params: Promise<{ token: string }>
}

const AcceptInvitation = async ({ params }: AcceptInvitationProps) => {
  const { token } = await params;
  try {
    const response = await getProjectInvitationItemService({token: token});
    return (
      <InvantionCard invitation={response.data} />
    );
  } catch {
    notFound()
  }
  
};

export default AcceptInvitation;
