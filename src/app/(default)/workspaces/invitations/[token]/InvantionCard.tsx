'use client'

import { acceptOrRejectWorkspaceInvitationService } from '@/services/client/workspace.service';
import { useAuth } from '@/providers/AuthProvider';
import { WorkspaceInvitation } from '@/types/workspace.type';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface Props{
  invitation: WorkspaceInvitation;
}

const InvantionCard: React.FC<Props> = ({invitation}) => {
    const [status] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const handleAction = async (action: 'accept' | 'reject') => {
      if (action === 'accept') {
        if (user){
          try{
            await acceptOrRejectWorkspaceInvitationService(invitation.token, {status: 'accepted'});
            router.push(`/dashboard/workspaces/${invitation.workspace.slug}/`)
          }catch(error){
            console.error(error);
          }
        }else{
          router.push('/register?next=/workspaces/invitations/accept/' + invitation.token); 
        }
      }    
    }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Siz `{invitation.workspace.title}` adlı virtual ofisə `{invitation.invited_by.full_name}` tərəfindən dəvət olunmusunuz!
        </h1>
        <p className="text-gray-700 mb-6">
          Bu dəvəti qəbul etmək və ya rədd etmək istəyirsinizmi?
        </p>

        {status && <p className="text-lg font-medium text-gray-800 mb-6">{status}</p>}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleAction('accept')}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
          >
            Qəbul et
          </button>
          <button
            onClick={() => handleAction('reject')}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
          >
            Rədd et
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvantionCard