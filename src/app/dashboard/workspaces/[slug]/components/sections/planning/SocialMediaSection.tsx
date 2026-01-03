import { InstagramLoginButton } from "@/components/common/buttons/InstagramLoginButton";
import { Planning } from "@/types/planning.type";
import { SocialAccount } from "@/types/social_account.type";
import { deletePlanningSoicalAccount } from "@/services/client/planning.service";
import DeleteSocialAccount from "../../modals/DeleteSocialAccount";
import React, { useState } from "react";
import {
  HiLink,
  HiPlus,
  HiTrash,
  HiExternalLink,
  HiCheck,
  HiX,
  HiPencil,
  HiRefresh,
  HiExclamation,
  HiSparkles,
  HiTrendingUp,
} from "react-icons/hi";
import Image from "next/image";
import usePlanningStore from "@/store/planningStore";

interface SocialMediaSectionProps {
  planning?: Planning;
  onPlatformClick?: (platform: any) => void;
}

const platformConfigs = {
  instagram: {
    name: "Instagram",
    color: "from-purple-500 via-pink-500 to-orange-500",
    bgColor: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
    accent: "purple",
    darkColor: "from-purple-600 via-pink-600 to-orange-600",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  facebook: {
    name: "Facebook",
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
    accent: "blue",
    darkColor: "from-blue-700 to-blue-800",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  tiktok: {
    name: "TikTok",
    color: "from-gray-800 to-black",
    bgColor: "bg-gradient-to-r from-gray-800 to-black",
    accent: "gray",
    darkColor: "from-gray-900 to-black",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  youtube: {
    name: "YouTube",
    color: "from-red-500 to-red-600",
    bgColor: "bg-gradient-to-r from-red-500 to-red-600",
    accent: "red",
    darkColor: "from-red-600 to-red-700",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  planning,
  onPlatformClick,
}) => {
  const [hoveredAccount, setHoveredAccount] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<SocialAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {fetchPlannings} = usePlanningStore();

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getConnectedPlatforms = () => {
    return planning?.social_accounts.map((acc) => acc.platform) || [];
  };

  const getAvailablePlatforms = () => {
    const connected = getConnectedPlatforms();
    return Object.keys(platformConfigs).filter(
      (platform) => !connected.includes(platform as any)
    );
  };

  const handleAccountAdd = (platform: string) => {
    onPlatformClick?.(platform);
    showNotification(
      "success",
      `${
        platformConfigs[platform as keyof typeof platformConfigs].name
      } hesabı əlavə edildi!`
    );
  };

  const handleAccountRemove = async (account: SocialAccount) => {
    setAccountToDelete(account);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      setIsDeleting(true);
      await deletePlanningSoicalAccount(accountToDelete.id);
      await fetchPlannings();
      showNotification("success", "Hesab uğurla silindi!");
      setDeleteModalOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      showNotification("error", "Hesab silinərkən xəta baş verdi!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  const handleAccountVisit = (account: SocialAccount) => {
    if (account.instagram_account) {
      window.open(`https://www.instagram.com/${account.instagram_account.username}`, "_blank");
      showNotification(
        "success",
        `${
          platformConfigs[account.platform as keyof typeof platformConfigs].name
        } hesabına yönləndirildi`
      );
    }
  };

  const handleStartEdit = (account: SocialAccount) => {
    setEditingAccount(account.id.toString());
    setEditUsername(account.instagram_account?.username || "");
  };

  const handleSaveEdit = (accountId: number) => {
    setEditingAccount(null);
    showNotification("success", "Hesab məlumatları yeniləndi!");
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setEditUsername("");
  };

  const handleRefreshAccount = async (accountId: number) => {
    setIsRefreshing(accountId.toString());
    setTimeout(() => {
      setIsRefreshing(null);
      showNotification("success", "Hesab məlumatları yeniləndi!");
    }, 2000);
  };

  const handleRefreshAll = async () => {
    setIsRefreshing("all");
    setTimeout(() => {
      setIsRefreshing(null);
      showNotification("success", "Bütün hesablar yeniləndi!");
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Delete Confirmation Modal */}
      <DeleteSocialAccount
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        account={accountToDelete}
        isDeleting={isDeleting}
      />

      {/* Enhanced Notification with Animation */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 transform translate-x-0 ${
            notification.type === "success"
              ? "bg-emerald-50/90 border-emerald-200/50 text-emerald-800"
              : "bg-red-50/90 border-red-200/50 text-red-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === "success"
                  ? "bg-emerald-100"
                  : "bg-red-100"
              }`}
            >
              {notification.type === "success" ? (
                <HiCheck className="w-5 h-5 text-emerald-600" />
              ) : (
                <HiX className="w-5 h-5 text-red-600" />
              )}
            </div>
            <span className="font-semibold text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Modern Glassmorphism Container */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 pointer-events-none" />
        
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-xl p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <HiSparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-white">
                    {planning?.social_accounts.length || 0}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Sosial Media Hesabları
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-1">
                  {planning?.social_accounts.length || 0} hesab aktiv şəkildə bağlanıb
                </p>
              </div>
            </div>

            {/* Enhanced Refresh Button */}
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing === "all"}
              className="group flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <HiRefresh
                className={`w-3.5 h-3.5 ${
                  isRefreshing === "all" ? "animate-spin" : "group-hover:rotate-180"
                } transition-transform duration-300`}
              />
              <span className="font-medium text-sm">
                {isRefreshing === "all" ? "Yenilənir..." : "Hamısını Yenilə"}
              </span>
            </button>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div className="relative p-4">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <HiCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Bağlanmış Hesablar</h4>
            </div>

            {!planning?.social_accounts.length ? (
              <div className="text-center py-8 relative">
                <div className="relative mx-auto mb-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md">
                    <HiLink className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <HiPlus className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h5 className="text-base font-semibold text-gray-700 mb-1">Hələ heç bir hesab bağlanmayıb</h5>
                <p className="text-sm text-gray-500">İlk sosial media hesabınızı əlavə edin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {planning.social_accounts.map((account) => {
                  const platform = platformConfigs[account.platform as keyof typeof platformConfigs];
                  const isEditing = editingAccount === account.id.toString();
                  const isRefreshingAccount = isRefreshing === account.id.toString();
                  const isHovered = hoveredAccount === account.id.toString();

                  return (
                    <div
                      key={account.id}
                      onMouseEnter={() => setHoveredAccount(account.id.toString())}
                      onMouseLeave={() => setHoveredAccount(null)}
                      className="group relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 p-4 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/95"
                    >
                      {/* Gradient Border Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                      
                      <div className="relative">
                        {/* Profile Section */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/50 group-hover:ring-white/80 transition-all duration-300">
                              {account.instagram_account?.profile_picture_url ? (
                                <Image
                                  src={account.instagram_account.profile_picture_url}
                                  alt={account.instagram_account.username || account.platform}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className={`w-full h-full ${platform.bgColor} flex items-center justify-center text-white`}>
                                  {platform.icon}
                                </div>
                              )}
                            </div>
                            {/* Platform Badge */}
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${platform.bgColor} flex items-center justify-center shadow-md ring-2 ring-white`}>
                              <div className="w-3 h-3 text-white">
                                {platform.icon}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
                              @{account.instagram_account?.username || account.platform}
                            </h3>
                            <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                              <HiTrendingUp className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">
                                {formatNumber(account.instagram_account?.followers_count || 0)} izləyici
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              account.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {account.status === "active" ? "Aktiv" : "Gözləmədə"}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAccountVisit(account)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Hesabı ziyarət et"
                            >
                              <HiExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRefreshAccount(account.id)}
                              disabled={isRefreshingAccount}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
                              title="Hesabı yenilə"
                            >
                              <HiRefresh className={`w-4 h-4 ${isRefreshingAccount ? 'animate-spin' : ''}`} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAccountRemove(account)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                            title="Hesabı sil"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enhanced Add Platform Section */}
          {getAvailablePlatforms().length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <HiPlus className="w-3.5 h-3.5 text-white" />
                </div>
                <h4 className="text-base font-bold text-gray-900">Yeni Hesab Əlavə Et</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {getAvailablePlatforms().map((platform) => {
                  const config = platformConfigs[platform as keyof typeof platformConfigs];
                  
                  if (platform === "instagram") {
                    return (
                      <InstagramLoginButton
                        key={platform}
                        className="group relative overflow-hidden !p-4 !bg-white/70 hover:!bg-white backdrop-blur-xl border-2 border-white/30 hover:border-white/60 !rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 !h-auto"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            {config.icon}
                          </div>
                          <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
                            {config.name}
                          </span>
                        </div>
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </InstagramLoginButton>
                    );
                  }
                  
                  return (
                    <button
                      key={platform}
                      className="group relative overflow-hidden p-4 bg-white/70 hover:bg-white backdrop-blur-xl border-2 border-white/30 hover:border-white/60 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          {config.icon}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
                          {config.name}
                        </span>
                      </div>
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer Stats */}
        <div className="relative bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-xl px-4 py-3 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Cəmi izləyici:{" "}
                  <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formatNumber(
                      planning?.social_accounts.reduce(
                        (sum, acc) => sum + (acc.instagram_account?.followers_count || 0),
                        0
                      ) || 0
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <span>Son yenilənmə: İndi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;