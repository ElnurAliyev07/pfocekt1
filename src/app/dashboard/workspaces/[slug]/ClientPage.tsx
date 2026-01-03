"use client";

import React, { useEffect, useRef, useState } from "react";
import useProjectStore from "@/store/projectStore";
import { getURLParam, removeURLParam } from "@/utils/urlUtils";
import useWorkspaceMemberStore from "@/store/workspaceMemberStore";
import usePlanningStore from "@/store/planningStore";
import { Workspace } from "@/types/workspace.type";
import Info from "./components/tabs/Info";
import TabsContainer from "./components/tabs/TabsContainer";
import { useVacancyStore } from "@/store/vacancy.store";
import { postInstagramCallbackService } from "@/services/client/instagram.service";
import { useSearchParams } from "next/navigation";
import InstagramAccountsModal from "./components/modals/InstagramAccountsModal";
import { useAppContext } from "@/providers/AppProvider";
import useGeneralStore from "@/store/generalStore";

interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  profile_picture_url: string;
  followers_count: number;
  media_count: number;
  biography: string;
  business_account_id: string;
  access_token: string;
}

interface Props {
  slug: string;
  workspace: Workspace;
}

const ClientPage: React.FC<Props> = ({ slug, workspace }) => {
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [instagramAccounts, setInstagramAccounts] = useState<
    InstagramAccount[]
  >([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>();

  const { isLoading, setLoadingText, setIsLoading } = useAppContext();
  const { selectedPlanning } = usePlanningStore();

  const {
    setSearchQuery: setProjectSearchQuery,
    setWorkspaceSlug,
    setWorkspace,
  } = useProjectStore();
  const { fetchWorkspaceMembers } = useWorkspaceMemberStore();
  const { fetchMemberShipStatuses } =
    useGeneralStore();

    const { workspaceSlug } = useProjectStore();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const loadinstagramCallback = async () => {
      const code = getURLParam("code");
      if (code && isFirstRender.current) {
        isFirstRender.current = false;
        setIsLoading(true);
        setLoadingText("Instagram hesabları yüklənir");

        try {
          const response = await postInstagramCallbackService({ code: code });
          if (response?.data?.instagram_accounts) {
            setInstagramAccounts(response.data.instagram_accounts);
            setIsInstagramModalOpen(true);
          }
          removeURLParam("code");
        } catch (error) {
          console.error("Instagram callback error:", error);
        } finally {
          setLoadingText(null);
          setIsLoading(false);
        }
      }
    };
    loadinstagramCallback();
  }, []);

  const handleSelectAccount = (account: InstagramAccount) => {
    setSelectedAccountId(account.id);
  };

  // 1. İlk değer atamaları (slug, workspace, search query)
  useEffect(() => {
    setWorkspaceSlug(slug);

    const search = getURLParam("search");
    setProjectSearchQuery(search || "");

    setWorkspace(workspace);
  }, [slug, workspace, setWorkspaceSlug, setProjectSearchQuery, setWorkspace]);

    useEffect(() => {
      const loadMemberShipStatuses = async () => {
          await fetchMemberShipStatuses();
      };
      loadMemberShipStatuses();
  }, [fetchMemberShipStatuses]);

  useEffect(() => {
    const loadUsers = async () => {
      await Promise.all([
        fetchWorkspaceMembers(true),
      ]);
    };
    loadUsers();
  }, [fetchWorkspaceMembers, workspaceSlug]);


  return (
    <>
      <Info />
      <TabsContainer />
      <InstagramAccountsModal
        isOpen={isInstagramModalOpen}
        onOpenChange={() => setIsInstagramModalOpen(false)}
        accounts={instagramAccounts}
        isLoading={isLoading}
        onSelect={handleSelectAccount}
        selectedAccountId={selectedAccountId}
        planningId={selectedPlanning?.id}
      />
    </>
  );
};

export default ClientPage;
