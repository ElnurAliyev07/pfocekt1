import React, { useState, useEffect } from "react";
import { formatDate } from "@/utils/formateDateTime";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaHeart, FaComment, FaShare, FaPaperPlane } from "react-icons/fa";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import useTaskItemStore from "@/store/taskItemStore";
import Image from "next/image";

const TaskInfo = () => {
  const { task, currentStatus, isJointPost } = useTaskItemStore();
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    platform: string;
    contentType: string;
    content: string;
  }>({
    isOpen: false,
    platform: "",
    contentType: "",
    content: "",
  });

  const [platformMedias, setPlatformMedias] = useState<Record<string, Array<{ id: number; file: string }>>>({});
  const [generalMedias, setGeneralMedias] = useState<Array<{ id: number; file: string }>>([]);

  useEffect(() => {
    if (task?.post) {
      // Genel medya dosyalarını ayarla
      setGeneralMedias(task.post.medias || []);

      // Joint post değilse platform özel medya dosyalarını ayarla
      if (!isJointPost && task.post.platform_schedules) {
        const medias: Record<string, Array<{ id: number; file: string }>> = {};
        task.post.platform_schedules.forEach(schedule => {
          const key = `${schedule.platform}_${schedule.content_type}`;
          medias[key] = schedule.medias || [];
        });
        setPlatformMedias(medias);
      } else {
        // Joint post ise platform medyalarını temizle
        setPlatformMedias({});
      }
    }
  }, [task?.post, isJointPost]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram className="w-4 h-4" />;
      case "facebook":
        return <FaFacebookF className="w-4 h-4" />;
      case "tiktok":
        return <FaTiktok className="w-4 h-4" />;
      case "youtube":
        return <FaYoutube className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getContentTypeDisplayName = (type: string) => {
    switch (type) {
      case "story":
        return "Story";
      case "reels":
        return "Reels";
      case "carousel":
        return "Karussel";
      case "post":
        return "Post";
      case "video":
        return "Video";
      case "short":
        return "Qısa Video";
      default:
        return type;
    }
  };

  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "tiktok":
        return "TikTok";
      case "youtube":
        return "YouTube";
      default:
        return platform;
    }
  };

  const renderMediaPreview = (platform: string, contentType: string) => {
    // Joint post ise sadece genel medya dosyalarını kullan
    if (isJointPost) {
      if (!generalMedias || generalMedias.length === 0) return null;

      const media = generalMedias[0];
      const fileUrl = media.file;
      const fileType = fileUrl.split('.').pop()?.toLowerCase() || '';

      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(fileType)) {
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              height={1000}
              width={1000}
              src={fileUrl} 
              alt="Media content" 
              className="w-full h-auto"
            />
          </div>
        );
      }

      if (['mp4', 'webm', 'mov'].includes(fileType)) {
        return (
          <div className="relative w-full h-full">
            <video 
              src={fileUrl} 
              controls 
              className="w-full h-full object-cover"
            />
          </div>
        );
      }
      return null;
    }

    // Joint post değilse platform özel medya dosyalarını kullan
    const key = `${platform}_${contentType}`;
    const medias = platformMedias[key] || [];

    if (!medias || medias.length === 0) return null;

    const media = medias[0];
    const fileUrl = media.file;
    const fileType = fileUrl.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(fileType)) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            width={1000}
            height={1000}
            src={fileUrl} 
            alt="Media content" 
            className="w-full h-auto"
          />
        </div>
      );
    }

    if (['mp4', 'webm', 'mov'].includes(fileType)) {
      return (
        <div className="relative w-full h-full">
          <video 
            src={fileUrl} 
            controls 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return null;
  };

  const renderPreviewModal = () => {
    const { platform, contentType, content } = previewModal;

    const getModalSize = () => {
      if (platform === "instagram" && contentType === "story") return "max-w-sm";
      if (platform === "instagram" && contentType === "reels") return "max-w-sm";
      if (platform === "tiktok") return "max-w-sm";
      return "max-w-md";
    };

    return (
      <Modal
        isOpen={previewModal.isOpen}
        onOpenChange={() => setPreviewModal({ ...previewModal, isOpen: false })}
        size="xl"
        placement="center"
        hideCloseButton
        className="flex shadow-none bg-transparent items-center justify-center"
      > 
        <ModalContent className={`${getModalSize()} bg-white text-black overflow-hidden`}>
          <button
            onClick={() => setPreviewModal({ ...previewModal, isOpen: false })}
            className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Instagram Post */}
          {platform === "instagram" && (contentType === "post" || contentType === "carousel") && (
            <>
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    <FaInstagram className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">your_account</p>
                    <p className="text-xs text-gray-500">İndi</p>
                  </div>
                </div>
                <button className="text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {contentType === "carousel" && task && task.post &&  task.post.medias && task.post.medias.length > 1 && (
                  <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {task.post.medias.length} şəkil
                  </div>
                )}
                {renderMediaPreview(platform, contentType)}
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <FaHeart className="w-6 h-6 text-gray-700 hover:text-red-500 cursor-pointer" />
                    <FaComment className="w-6 h-6 text-gray-700 cursor-pointer" />
                    <FaPaperPlane className="w-6 h-6 text-gray-700 cursor-pointer" />
                  </div>
                  <svg className="w-6 h-6 text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                
                <p className="text-sm font-semibold mb-1">147 bəyənmə</p>
                <p className="text-sm">
                  <span className="font-semibold mr-2">your_account</span>
                  {content}
                </p>
                <p className="text-xs text-gray-500 mt-2">Bütün şərhləri gör</p>
                <p className="text-xs text-gray-400 mt-1">2 saat əvvəl</p>
              </div>
            </>
          )}

          {/* Instagram Story */}
          {platform === "instagram" && contentType === "story" && (
            <div className="aspect-[9/16] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 p-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaInstagram className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">your_account</span>
                    <span className="text-white/70 text-xs">İndi</span>
                  </div>
                  <button className="text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                <div className="w-full h-0.5 bg-white/30 mt-3">
                  <div className="w-1/3 h-full bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="h-full">
                {renderMediaPreview(platform, contentType)}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="text-white text-lg font-medium leading-relaxed drop-shadow-lg">
                      {content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instagram Reels */}
          {platform === "instagram" && contentType === "reels" && (
            <div className="aspect-[9/16] bg-black relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
              
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      <FaInstagram className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">your_account</span>
                  </div>
                  <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">Reels</span>
                </div>
              </div>
              
              <div className="h-full">
                {renderMediaPreview(platform, contentType)}
              </div>
              
              <div className="absolute bottom-4 left-4 right-16 z-10">
                <p className="text-white text-sm font-medium mb-2">your_account</p>
                <p className="text-white text-sm leading-relaxed">{content}</p>
              </div>
              
              <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-4">
                <div className="text-center">
                  <FaHeart className="w-7 h-7 text-white mx-auto mb-1" />
                  <span className="text-white text-xs">1.2K</span>
                </div>
                <div className="text-center">
                  <FaComment className="w-7 h-7 text-white mx-auto mb-1" />
                  <span className="text-white text-xs">89</span>
                </div>
                <div className="text-center">
                  <FaShare className="w-7 h-7 text-white mx-auto mb-1" />
                  <span className="text-white text-xs">12</span>
                </div>
              </div>
            </div>
          )}

          {/* Facebook Post */}
          {platform === "facebook" && (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaFacebookF className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Səhifə Adı</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">İndi</span>
                      <span className="text-xs text-gray-500">·</span>
                      <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <button className="text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-800 mb-4 leading-relaxed">{content}</p>
                
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {renderMediaPreview(platform, contentType)}
                </div>
                
                <div className="flex items-center justify-between py-2 border-t border-gray-200 mt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <FaHeart className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-gray-600">124</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaComment className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">8 şərh</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaShare className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">3 paylaşım</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TikTok */}
          {platform === "tiktok" && (
            <div className="aspect-[9/16] bg-black relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
              
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">Sizin üçün</span>
                  <FaTiktok className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="h-full">
                {renderMediaPreview(platform, contentType)}
              </div>
              
              <div className="absolute bottom-4 left-4 right-16 z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                    <FaTiktok className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">@username</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-xs">Takip et</span>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <span className="text-white text-xs">2s</span>
                    </div>
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed mb-2">{content}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-xs">#fyp #viral</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1">
                    <FaHeart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs">2.1K</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1">
                    <FaComment className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs">89</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1">
                    <FaShare className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs">12</span>
                </div>
              </div>
            </div>
          )}

          {/* YouTube */}
          {platform === "youtube" && (
            <>
              <div className="aspect-video bg-black relative  ">
                {renderMediaPreview(platform, contentType)}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 rounded px-2 py-1 text-white text-sm inline-block">
                    0:00 / 2:34
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 leading-tight">{content}</h3>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FaYoutube className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Kanal Adı</p>
                        <p className="text-xs text-gray-500">1.2K abunə</p>
                      </div>
                      <button className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                        Abunə ol
                      </button>
                    </div>
                    <div className="flex items-center space-x-6 mt-3">
                      <div className="flex items-center space-x-1">
                        <FaHeart className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">892</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaShare className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Paylaş</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      <h2 className="flex items-center text-t-black text-2xl font-semibold leading-tight">
        <svg
          className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400 shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17 0H3C1.346 0 0 1.346 0 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V3c0-1.654-1.346-3-3-3Zm-1 15H4V5h12v10Zm-2-8H6v2h8V7Z" />
        </svg>
        <span>{task?.title}</span>
      </h2>

      {/* Sosyal Medya Görevi Bilgileri */}
      {task?.is_social_media_task && task?.post && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Sosial Media Planlaması
          </h3>

          <div className="space-y-4">
            {/* Platform və İçerik Türleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.post.platform_schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getPlatformIcon(schedule.platform)}
                    <span className="font-medium text-gray-700">
                      {getPlatformDisplayName(schedule.platform)}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="text-purple-600">
                      {getContentTypeDisplayName(schedule.content_type)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Planlanan: {formatDate(schedule.scheduled_date)}
                    </div>
                    {schedule.published_date && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Dərc edildi: {formatDate(schedule.published_date)}
                      </div>
                    )}
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          schedule.status === "published"
                            ? "bg-green-100 text-green-800"
                            : schedule.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : schedule.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {schedule.status === "published"
                          ? "Dərc edildi"
                          : schedule.status === "scheduled"
                          ? "Planlandı"
                          : schedule.status === "draft"
                          ? "Hazırlanır"
                          : "Uğursuz"}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setPreviewModal({
                          isOpen: true,
                          platform: schedule.platform,
                          contentType: schedule.content_type,
                          content: isJointPost ? task.post.content : schedule.content_override || '',
                        })
                      }
                      className="mt-2 w-full py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md text-sm font-medium transition-colors"
                    >
                      Önizləmə
                    </button>
                  </div>
                </div>
              ))}
            </div>

           
          </div>
        </div>
      )}

      <div className="mt-2 space-y-1">
        <p className="flex items-center text-sm font-medium text-t-gray dark:text-gray-400">
          <svg
            className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
            <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
          Başlama: {formatDate(task?.started || "")}
        </p>
        {task?.deadline && (
          <p className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
            <svg
              className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            Bitmə: {formatDate(task?.deadline || "")}
          </p>
        )}
      </div>

      {task?.content && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-blue-600 mr-2 dark:text-blue-400 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <h3 className="text-t-black text-sm font-semibold dark:text-white">
              Qeyd:
            </h3>
          </div>
          <p className="text-sm text-t-gray pr-2 leading-relaxed dark:text-gray-300">
            {task.content}
          </p>
        </div>
      )}

      {renderPreviewModal()}
    </>
  );
};

export default TaskInfo;