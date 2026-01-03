'use client'

import Loading from '@/components/ui/loading/NavigationLoading';
import { acceptOrRejectProjectInvitationService } from '@/services/client/project.service';
import { useAuth } from '@/providers/AuthProvider';
import { ProjectInvitation } from '@/types/project.type';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

interface Props {
    invitation: ProjectInvitation;
}

const AcceptInvitation: React.FC<Props> = ({ invitation }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            acceptOrRejectProjectInvitationService(invitation.token, {status: 'accepted'}).then(() => {
                router.push(`/dashboard/projects/${invitation.project.slug}/`);
            });
        } else {
            router.push(`/register?next=/projects/invitations/accept/${invitation.token}`);
        }
    }, [user, router, invitation])


    return (
        <Loading/>
    )
}

export default AcceptInvitation
