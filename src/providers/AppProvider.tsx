'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Config } from "@/types/config.type";
import { usePathname } from "next/navigation";
import { getMembershipStatusService } from "@/services/client/membershipStatus.service";
import { getPlatformService } from "@/services/client/platform.service";
import { getProfessionService } from "@/services/client/profession.service";
import { KeyLabel } from "@/types/membershipStatus.type";
import { Profession } from "@/types/profession.type";

interface AppContextType {
  // State
  isInitialized: boolean;
  language: string | null;
  isLoading: boolean;
  loadingText: string | null;
  memberShipStatuses: KeyLabel[];
  platforms: KeyLabel[];
  professions: Profession[];
  config: Config | null;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  
  // Actions
  setLoadingText: (loadingText: string | null) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  setConfig: (config: Config) => void;
  setLanguage: (language: string) => void;
  setIsLoading: (loading: boolean) => void;
  fetchMemberShipStatuses: () => Promise<void>;
  fetchPlatforms: () => Promise<void>;
  fetchProfessions: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  config: Config;
  deviceTypeProp: 'mobile' | 'tablet' | 'desktop';
}

export function AppProvider({ children, config, deviceTypeProp }: Props) {
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [memberShipStatuses, setMemberShipStatuses] = useState<KeyLabel[]>([]);
  const [platforms, setPlatforms] = useState<KeyLabel[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [appConfig, setAppConfig] = useState<Config>(config);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(deviceTypeProp)
  
  const pathname = usePathname();

  // Path tracking
  useEffect(() => {
    const currentPath = pathname;
    const lastPath = sessionStorage.getItem('lastVisitedPath');
    if (!lastPath || lastPath !== currentPath) {
      sessionStorage.setItem('lastVisitedPath', currentPath);
    }
  }, [pathname]);

  useEffect(() => {
    setIsInitialized(true);
  }, []);


  // Actions
  const handleSetLoadingText = (loadingText: string | null) => {
    setLoadingText(loadingText);
  };

  const handleSetIsInitialized = (isInitialized: boolean) => {
    setIsInitialized(isInitialized);
  };

  const handleSetConfig = (config: Config) => {
    setAppConfig(config);
  };

  const handleSetLanguage = (language: string) => {
    setLanguage(language);
  };

  const handleSetIsLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const fetchMemberShipStatuses = async () => {
    try {
      const response = await getMembershipStatusService();
      setMemberShipStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await getPlatformService();
      setPlatforms(response.data);
    } catch (error) {
      console.error("Error fetching platforms:", error);
    }
  };

  const fetchProfessions = async () => {
    try {
      const response = await getProfessionService();
      setProfessions(response.data);
    } catch (error) {
      console.error("Error fetching professions:", error);
    }
  };

  const contextValue: AppContextType = {
    // State
    isInitialized,
    language,
    isLoading,
    loadingText,
    memberShipStatuses,
    platforms,
    professions,
    config: appConfig,
    deviceType: deviceType,
    
    // Actions
    setLoadingText: handleSetLoadingText,
    setIsInitialized: handleSetIsInitialized,
    setConfig: handleSetConfig,
    setLanguage: handleSetLanguage,
    setIsLoading: handleSetIsLoading,
    fetchMemberShipStatuses,
    fetchPlatforms,
    fetchProfessions,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
} 