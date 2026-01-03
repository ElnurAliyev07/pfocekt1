'use client'

import Loading from '@/components/ui/loading/NavigationLoading';
import { acceptOrRejectWorkspaceInvitationService } from '@/services/client/workspace.service';
import { useAuth } from '@/providers/AuthProvider';
import { WorkspaceInvitation } from '@/types/workspace.type';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

interface Props {
    invitation: WorkspaceInvitation;
}

const AcceptInvitation: React.FC<Props> = ({ invitation }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            acceptOrRejectWorkspaceInvitationService(invitation.token, {status: 'accepted'}).then(() => {
                router.push(`/dashboard/workspaces/${invitation.workspace.slug}/`);
            });
        } else {
            router.push(`/register?next=/workspaces/invitations/accept/${invitation.token}`);
        }
    }, [user, router, invitation])


    return (
        <Loading/>
    )
}

export default AcceptInvitation
