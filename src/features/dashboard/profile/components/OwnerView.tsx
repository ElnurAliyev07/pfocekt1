"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Star,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  GraduationCap,
  Languages,
  Award,
  Facebook,
  Instagram,
  Youtube,
  Edit,
  Mail,
  Users,
  Eye,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Building2,
  Clock,
  Globe,
  Camera,
  Plus,
  Check,
  PlusCircle,
  Ban,
  User as UserIcon,
  Info,
  Trash2,
  Crop,
  User2Icon,
} from "lucide-react";
import { Experience, User } from "@/types/auth.type";
import { useAuth } from "@/providers/AuthProvider";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import Image from "next/image";
import ImageCropModal from "@/components/common/modals/ImageCropModal";
import { updateUserService } from "@/services/client/user.service";
import { UserUpdateRequest } from "@/types/user.type";
import { convertFileToBase64 } from "@/utils/base64";
import { getProfileService } from "@/services/server/profile.service";
import { setUserCookie } from "@/lib/actions/user";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Portfolio from './Portfolio';
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/providers/AppProvider";

// Education form validation schema
const educationSchema = z
  .object({
    institution: z.string().min(2, "Təhsil müəssisəsi tələb olunur"),
    started_year: z.string().min(4, "Başlanğıc ili tələb olunur"),
    finished_year: z.string().min(1, "Bitmə ili tələb olunur"),
    description: z.string().optional(),
  })
  .refine(
    (data) =>
      data.finished_year === "0" ||
      Number(data.finished_year) >= Number(data.started_year),
    {
      message: "Bitmə ili başlanğıc ildən əvvəl ola bilməz",
      path: ["finished_year"],
    }
  );
type EducationFormType = z.infer<typeof educationSchema>;

const OwnerPage: React.FC = () => {
  const { user, setUser } = useAuth();

  const { setIsLoading } = useAppContext();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-500">
        Profil tapılmadı veya yüklənir...
      </div>
    );
  }
  const profile = user.user_profile;
  const isOwner = true;

  // Modal state
  const [activeModal, setActiveModal] = useState<
    | "profile"
    | "about"
    | "image"
    | "background"
    | "education"
    | "experience"
    | "salary"
    | "be_freelancer"
    | null
  >(null);
  const [imageToCrop, setImageToCrop] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [backgroundToCrop, setBackgroundToCrop] = useState<File | null>(null);
  const [croppedBackground, setCroppedBackground] = useState<File | null>(null);
  const [showBackgroundPreview, setShowBackgroundPreview] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [educationForm, setEducationForm] = useState({
    institution: "",
    started_year: "",
    finished_year: "",
    description: "",
  });
  const [isEducationSaving, setIsEducationSaving] = useState(false);
  const [editEducationIndex, setEditEducationIndex] = useState<number | null>(
    null
  );

  const handleEditEducation = (index: number) => {
    const edu = educations[index];
    if (edu) {
      setEducationForm({
        institution: edu.institution,
        started_year: edu.started_year?.toString() || "",
        finished_year: edu.finished_year?.toString() || "",
        description: edu.description || "",
      });
      setEditEducationIndex(index);
      setAddEducationModalOpen(true);
    }
  };

  // State güncellemeleri:
  const [activeEducationModal, setActiveEducationModal] = useState<null | {
    type: "edit" | "delete";
    id: string | number;
  }>(null);
  const [addEducationModalOpen, setAddEducationModalOpen] = useState(false);

  // Local education state (mövcud və əlavə ediləcək təhsillər üçün tək siyahı)
  const [educations, setEducations] = useState<any[]>(profile.educations || []);

  // Səhifə ilk açıldıqda və ya user/profil dəyişəndə bir dəfə doldur
  useEffect(() => {
    setEducations(
      (profile.educations || []).map((edu) => ({
        ...edu,
        id:
          edu.id ??
          "tmp-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      }))
    );
  }, [user?.id, profile?.id]);

  // Local form state
  const [editForm, setEditForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    profession: profile.profession?.name || "",
    location: profile.location || "",
    facebook_link: profile.facebook_link || "",
    instagram_link: profile.instagram_link || "",
    youtube_link: profile.youtube_link || "",
    description: profile.description || "",
    email: user.email || "",
    phone_number: profile.phone_number,
    date_of_birth: profile.date_of_birth,
    gender:
      profile.gender &&
      (profile.gender.key === "male" || profile.gender.key === "female")
        ? profile.gender.key
        : "male",
    main_profession: profile.profession?.name || "",
  });

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleEditSave = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setIsSaving(true);

    const userUpdateData: UserUpdateRequest = {
      first_name: editForm.first_name,
      last_name: editForm.last_name,
      email: editForm.email,
      user_profile: {
        description: editForm.description,
        facebook_link: editForm.facebook_link,
        instagram_link: editForm.instagram_link,
        youtube_link: editForm.youtube_link,
        location: editForm.location,
        phone_number: editForm.phone_number,
        date_of_birth: editForm.date_of_birth,
        gender: editForm.gender, // string only for API
        main_profession: editForm.main_profession,
      },
    };

    try {
      // Update user on server
      await updateUserService(user.id, userUpdateData);
      // Update local user state with changed fields
      const updatedUser: User = {
        ...user,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        full_name: editForm.first_name + " " + editForm.last_name,
        user_profile: {
          ...user.user_profile,
          description: editForm.description,
          facebook_link: editForm.facebook_link,
          instagram_link: editForm.instagram_link,
          youtube_link: editForm.youtube_link,
          location: editForm.location,
          phone_number: editForm.phone_number,
          date_of_birth: editForm.date_of_birth,
          gender: getGenderObject(editForm.gender, user.user_profile.gender),
          profession: {
            name: editForm.main_profession,
          },
        },
      };
      setUser(updatedUser);
      setUserCookie(updatedUser);
      setActiveModal(null);
    } catch (error) {
      console.error("Profil yenilənmədi:", error);
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageToCrop(e.target.files[0]);
    }
  };

  const handleEditCurrentImage = async () => {
    try {
      setIsLoading(true);
      if (!profile.image) return;
      // Fetch the image from the URL
      const response = await fetch(
        `/api/proxy?url=${encodeURIComponent(profile.image)}`
      );
      const blob = await response.blob();

      // Create a File object from the blob
      const file = new File([blob], "profile-image.jpg", { type: blob.type });

      setImageToCrop(file);
    } catch (error) {
      console.error("Error fetching current profile image:", error);
      // Handle error (e.g., show a toast message)
    } finally {
      setIsLoading(false);
    }
  };

  const onCrop = (file: File) => {
    setCroppedImage(file);
    // Optionally close the main image modal after crop
    // setActiveModal(null);
  };

  const handleImageSave = async () => {
    if (!user?.id || !croppedImage) return;
    setIsSaving(true);
    setIsLoading(true);
    try {
      const base64Image = await convertFileToBase64(croppedImage);
      const userUpdateData: UserUpdateRequest = {
        user_profile: {
          image: base64Image,
        },
      };
      await updateUserService(user.id, userUpdateData);
      const userResponse = await getProfileService({ id: user.id });
      console.log(userUpdateData);
      console.log(userResponse);
      setUser(userResponse.data);
      setUserCookie(userResponse.data);
      setActiveModal(null);
      setCroppedImage(null);
    } catch (error) {
      console.error("Profil şəkli yenilənmədi:", error);
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleBackgroundFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setBackgroundToCrop(e.target.files[0]);
    }
  };

  const handleBackgroundSave = async (file: File) => {
    if (!user?.id || !file) return;
    setIsSaving(true);
    setIsLoading(true);
    try {
      const base64Image = await convertFileToBase64(file);
      const userUpdateData: UserUpdateRequest = {
        user_profile: {
          background_image: base64Image,
        },
      };
      await updateUserService(user.id, userUpdateData);
      const userResponse = await getProfileService({ id: user.id });
      setUser(userResponse.data);
      setUserCookie(userResponse.data);
      setActiveModal(null);
      setBackgroundToCrop(null);
      setCroppedBackground(null);
    } catch (error) {
      console.error("Arka plan şəkli yenilənmədi:", error);
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const backgroundInputRef = useRef<HTMLInputElement>(null);
 
  const onBackgroundCrop = (file: File) => {
    setCroppedBackground(file);
    const url = URL.createObjectURL(file);
    setSelectedBackground(url);
    setShowBackgroundPreview(true);
    setActiveModal(null);
  };

  // Önerilen arka plan görselleri:
  const suggestedBackgrounds = [
    "/dashboard/profile/default-bg1.jpg",
    "/dashboard/profile/default-bg2.jpg",
    "/dashboard/profile/default-bg3.jpg",
  ];

  // Education related:
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) =>
    (currentYear - i).toString()
  );

  // Düzenle modalı açıldığında educationForm state'ini güncelle:
  useEffect(() => {
    if (activeModal === "education") {
      setEducations(profile.educations || []);
    }
    if (activeEducationModal && activeEducationModal.type === "edit") {
      const edu = educations.find((e) => e.id === activeEducationModal.id);
      setEducationForm({
        institution: edu?.institution || "",
        started_year: edu?.started_year ? edu.started_year.toString() : "",
        finished_year: edu?.finished_year ? edu.finished_year.toString() : "",
        description: edu?.description || "",
      });
    }
  }, [activeModal, activeEducationModal]);

  // Experience state
  const [experiences, setExperiences] = useState<Experience[]>(
    profile.experiences || []
  );
  useEffect(() => {
    setExperiences(
      (profile.experiences || []).map((exp) => ({
        ...exp,
        id:
          exp.id ??
          "tmp-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      }))
    );
  }, [user?.id, profile?.id]);

  // Experience form state
  const [experienceForm, setExperienceForm] = useState({
    company: "",
    started_year: "",
    finished_year: "",
    description: "",
  });
  const [editExperienceIndex, setEditExperienceIndex] = useState<number | null>(
    null
  );
  const [addExperienceModalOpen, setAddExperienceModalOpen] = useState(false);
  const [isExperienceSaving, setIsExperienceSaving] = useState(false);

  // State-lər:
  const [activeSkillsModal, setActiveSkillsModal] = useState(false);
  const [skills, setSkills] = useState(profile.skills || []);
  const [newSkill, setNewSkill] = useState("");
  // Editable skill state
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(
    null
  );
  const [editingSkillValue, setEditingSkillValue] = useState("");

  // Languages modal state
  const [activeLanguagesModal, setActiveLanguagesModal] = useState(false);
  const [languages, setLanguages] = useState(profile.user_languages || []);
  const [newLanguage, setNewLanguage] = useState({ name: "", level: "" });
  const [editingLanguageIndex, setEditingLanguageIndex] = useState<
    number | null
  >(null);
  const [editingLanguage, setEditingLanguage] = useState({
    name: "",
    level: "",
  });

  // Helper for gender
  const genderOptions = [
    { key: "male", label: "Kişi" },
    { key: "female", label: "Qadın" },
  ];
  function getGenderObject(
    key: string | null | undefined,
    fallback: { key: "male" | "female"; label: string }
  ): { key: "male" | "female"; label: string } {
    if (key === "male" || key === "female") {
      return genderOptions.find((g) => g.key === key) as {
        key: "male" | "female";
        label: string;
      };
    }
    return fallback;
  }

  // Add state for be_freelancer modal
  const [isFreelancer, setIsFreelancer] = useState(!!profile.is_freelancer);
  const [isFreelancerSaving, setIsFreelancerSaving] = useState(false);

  // Handler for saving freelancer info
  const handleFreelancerSave = async () => {
    if (!user?.id) return;
    setIsFreelancerSaving(true);
    setIsLoading(true);
    try {
      const userUpdateData: UserUpdateRequest = {
        user_profile: {
          is_freelancer: isFreelancer,
        },
      };
      await updateUserService(user.id, userUpdateData);
      const userResponse = await getProfileService({ id: user.id });
      setUser(userResponse.data);
      setUserCookie(userResponse.data);
      setActiveModal(null);
    } catch (error) {
      // handle error
    } finally {
      setIsFreelancerSaving(false);
      setIsLoading(false);
    }
  };

  // Add state for salary modal
  const [salaries, setSalaries] = useState(profile.salaries || []);
  const [isSalarySaving, setIsSalarySaving] = useState(false);
  const [salaryForm, setSalaryForm] = useState<{
    salary_type: "monthly" | "project_based" | "package_based";
    amount: string;
    is_visible: boolean;
  }>({
    salary_type: "monthly",
    amount: "",
    is_visible: true,
  });
  const [editSalaryIndex, setEditSalaryIndex] = useState<number | null>(null);
  const [salaryError, setSalaryError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "overview";

  // Add tab state
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio">(tab as "overview" | "portfolio");

  // Sync activeTab with URL on mount and when searchParams change
  useEffect(() => {
    const currentTab = searchParams.get("tab") || "overview";
    setActiveTab(currentTab as "overview" | "portfolio");
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Modern Profile Header Card */}
        <div className="bg-white shadow-lg overflow-hidden rounded-2xl">
          {/* Cover Section with Gradient */}
          <div className="relative">
            {profile.background_image ? (
              <div className="h-40 lg:h-56 relative overflow-hidden">
                <Image
                  src={profile.background_image}
                  alt="Profil arka planı"
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            ) : (
              <div className="h-40 lg:h-56 bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
              </div>
            )}
            {/* Camera Button */}
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBackground(
                    profile.background_image ||
                      "/dashboard/profile/default-bg.jpg"
                  );
                  setShowBackgroundPreview(true);
                }}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-700 p-2 rounded-full shadow-lg transition-all duration-200 z-20 flex items-center justify-center"
                title="Qapaq şəklini dəyiş"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-4 lg:px-8 pb-6 relative">
            {/* Edit Button - sağ üst köşe */}
            {isOwner && (
              <button
                onClick={() => setActiveModal("profile")}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg shadow transition-all duration-200 z-30"
                title="Profil məlumatlarını redaktə et"
              >
                <Edit className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {/* Profile Picture - float, left, between cover and card, responsive */}
            <button
              type="button"
              onClick={() => {
                if (isOwner) setActiveModal("image");
              }}
              className={`absolute -top-16 sm:-top-28 transform z-20 group ${
                isOwner ? "cursor-pointer" : ""
              }`}
              aria-label="Profil şəklini dəyiş"
            >
              <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full shadow-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white">
                <Image
                  src={profile.image || "/user.png"}
                  alt={user.full_name || "User"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {isOwner ? (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              ) : (
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
            <div className="flex flex-col md:flex-row items-start pt-10 sm:pt-14 z-10 w-full md:justify-between">
              {/* Sol: Ana Bilgiler */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mt-2">
                  {user.full_name ? (
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {user.full_name}
                    </h1>
                  ) : (
                    <div className="h-6 w-28 sm:h-7 sm:w-40 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg animate-pulse" />
                  )}
                </div>
                {profile.profession ? (
                  <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-medium mt-2">
                    {profile.profession.name}
                  </p>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                    <Briefcase className="w-3 h-3" /> Peşə əlavə edilməyib
                  </span>
                )}
                {profile.location ? (
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-sm">
                      {profile.location}
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                    <MapPin className="w-3 h-3" /> Şəhər əlavə edilməyib
                  </span>
                )}
                {/* Sosyal Linkler kaldırıldı */}
                {/* Eğer owner ise ve bilgiler eksikse modern info card */}
                {isOwner &&
                  (!user.full_name ||
                    !profile.profession ||
                    !profile.location) && (
                    <div className="mt-4 w-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center gap-3 px-4 py-3">
                      <Info className="w-5 h-5 text-blue-400" />
                      <div className="flex-1 text-sm text-blue-700">
                        Profilinizi tamamlayın və daha cəlbedici edin!
                      </div>
                      <button
                        onClick={() => setActiveModal("profile")}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition-all"
                      >
                        Profilini tamamla
                      </button>
                    </div>
                  )}
               
                
                {isOwner && !profile.is_freelancer && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveModal("be_freelancer")}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-blue-600 hover:text-blue-600 text-gray-700 rounded-md font-medium transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                    >
                      <User2Icon className="w-4 h-4" />
                      Freelancer ol
                    </button>
                  </div>
                )}

                {/* Social Links kaldırıldı */}
              </div>
              {/* Sağ: İstatistikler veya ek bilgiler */}
              <div className="flex flex-col md:flex-col items-center md:items-end md:gap-2 w-full md:w-auto md:mt-0">
                {/* Sosyal Linkler kaldırıldı */}
                {/* Mesaj yaz, Freelancer ve Paylaş butonları (sadece owner değilse) */}
                {!isOwner && (
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all">
                      <MessageCircle className="w-4 h-4" />
                      Mesaj yaz
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold shadow transition-all">
                      <Share2 className="w-4 h-4" />
                      Paylaş
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mt-6 mb-6 border-b border-gray-200">
          <button
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
            }`}
            onClick={() => {
              setActiveTab("overview");
              const params = new URLSearchParams(searchParams.toString());
              params.set("tab", "overview");
              router.push(`?${params.toString()}`, { scroll: false });
            }}
          >
            Ümumi
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "portfolio"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
            }`}
            onClick={() => {
              setActiveTab("portfolio");
              const params = new URLSearchParams(searchParams.toString());
              params.set("tab", "portfolio");
              router.push(`?${params.toString()}`, { scroll: false });
            }}
          >
            Portfolio
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Haqqında
                    </h2>
                    {isOwner && (
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setActiveModal("about")}
                        type="button"
                        aria-label="Haqqında məlumatını redaktə et"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {(!profile.description ||
                    profile.description.trim() === "") &&
                  !profile.phone_number &&
                  !profile.date_of_birth &&
                  !profile.gender &&
                  !user.email ? (
                    isOwner ? (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-400 text-xs">
                          Profilinizə özünüz haqqında məlumat əlavə edin.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-300 text-xs">
                          Hələ haqqında məlumat əlavə edilməyib.
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="text-gray-700 text-sm leading-normal whitespace-pre-line space-y-2">
                      {profile.description && <p>{profile.description}</p>}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                        {user.email && (
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {user.email}
                          </div>
                        )}
                        {profile.phone_number && (
                          <div>
                            <span className="font-medium">Telefon:</span>{" "}
                            {profile.phone_number}
                          </div>
                        )}
                        {profile.date_of_birth && (
                          <div>
                            <span className="font-medium">Doğum tarixi:</span>{" "}
                            {profile.date_of_birth}
                          </div>
                        )}
                        {profile.gender &&
                          (profile.gender.key === "male" ||
                            profile.gender.key === "female") &&
                          typeof profile.gender.label === "string" && (
                            <div>
                              <span className="font-medium">Cins:</span>{" "}
                              {profile.gender.label}
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Təhsil
                    </h2>
                    {isOwner && (
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setActiveModal("education")}
                        type="button"
                        aria-label="Təhsil məlumatını redaktə et"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {educations.length === 0 ? (
                    isOwner ? (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-400 text-xs">
                          Təhsil məlumatlarınızı əlavə edin.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-300 text-xs">
                          Hələ təhsil məlumatı əlavə edilməyib.
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="space-y-4">
                      {educations.map((edu, idx) => (
                        <div
                          key={edu.id || idx}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            🏫
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {edu.institution}
                            </div>
                            <div className="text-xs text-gray-600">
                              {edu.started_year} -{" "}
                              {edu.finished_year === 0
                                ? "İndi"
                                : edu.finished_year}
                            </div>
                            <div className="text-xs text-gray-500">
                              {edu.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm mt-8">
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Təcrübə
                    </h2>
                    {isOwner && (
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setActiveModal("experience")}
                        type="button"
                        aria-label="Təcrübə məlumatını redaktə et"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {experiences.length === 0 ? (
                    isOwner ? (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-400 text-xs">
                          Təcrübə məlumatlarınızı əlavə edin.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-300 text-xs">
                          Hələ təcrübə məlumatı əlavə edilməyib.
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="space-y-4">
                      {experiences.map((exp, idx) => (
                        <div
                          key={exp.id || idx}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            💼
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {exp.institution}
                            </div>
                            <div className="text-xs text-gray-600">
                              {exp.started_year} -{" "}
                              {exp.finished_year === 0
                                ? "İndi"
                                : exp.finished_year}
                            </div>
                            <div className="text-xs text-gray-500">
                              {exp.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Bacarıqlar
                    </h2>
                    {isOwner && (
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setActiveSkillsModal(true)}
                        type="button"
                        aria-label="Bacarıqları redaktə et"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {skills.length === 0 ? (
                    isOwner ? (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-400 text-xs">
                          Bacarıqlarınızı əlavə edin.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-300 text-xs">
                          Hələ bacarıq əlavə edilməyib.
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={skill.id || idx}
                          className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-4 py-1 text-sm font-medium shadow-sm"
                        >
                          <span className="mr-2">⭐</span>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-3 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                      Dillər
                    </h2>
                    {isOwner && (
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setActiveLanguagesModal(true)}
                        type="button"
                        aria-label="Dilləri redaktə et"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {languages.length === 0 ? (
                    isOwner ? (
                      <div className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-400 text-xs">
                          Dillərinizi əlavə edin.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-300 text-xs">
                          Hələ dil əlavə edilməyib.
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {languages.map((lang, idx) => (
                        <div
                          key={lang.id || idx}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {lang.language?.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                            {lang.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {profile?.is_freelancer && (
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-bold text-primary-900">
                        Xidmət haqqı
                      </h3>
                      {isOwner && (
                        <button
                          onClick={() => setActiveModal("salary")}
                          type="button"
                          aria-label="Xidmət haqqını redaktə et"
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition"
                        >
                          <Edit className="w-4 h-4 " />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 mt-2">
                      {salaries.length === 0 ? (
                        <div className="p-2 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                          <span className="text-gray-300 text-xs">
                            Hələ xidmət haqqı əlavə edilməyib.
                          </span>
                        </div>
                      ) : (
                        salaries.map((salary, key) => (
                          <div
                            key={key}
                            className="p-2 rounded-lg border border-primary-200"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-primary-900">
                                {salary.salary_type === "monthly"
                                  ? "Aylıq"
                                  : "Layihə"}
                              </span>
                              <span className="text-base font-bold text-primary-700">
                                {salary.amount} / AZN
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {/* Other Professions */}
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Digər bacarıqları</h3>
                  <div className="space-y-3">
                    {profile.other_professions.map((prof) => (
                      <div key={prof.id} className="text-gray-700 hover:text-blue-600 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                        {prof.name}
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
        ) : (
          <Portfolio isOwner={isOwner} user={user} />
        )}
      </div>
      {/* Edit Profile Modal */}
      <Modal
        isOpen={activeModal === "profile"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Profil məlumatlarını redaktə et</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <form
            id="profile-edit-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
          >
            {/* Ad */}
            <div className="mb-4">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ad
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={editForm.first_name}
                onChange={handleEditChange}
                placeholder="Adınızı daxil edin"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Soyad */}
            <div className="mb-4">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Soyad
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={editForm.last_name}
                onChange={handleEditChange}
                placeholder="Soyadınızı daxil edin"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Peşə */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peşə
              </label>
              <input
                type="text"
                name="main_profession"
                value={editForm.main_profession}
                onChange={handleEditChange}
                placeholder="Məsələn: Frontend Developer"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Şəhər/Ölkə */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şəhər/Ölkə
              </label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                placeholder="Bakı, Azərbaycan"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Bio / Haqqında - Bu modalda artıq olmayacaq */}
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
          >
            Ləğv et
          </button>
          <button
            type="submit"
            form="profile-edit-form"
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      {/* Edit About Modal */}
      <Modal
        isOpen={activeModal === "about"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Haqqında məlumatını redaktə et</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <form
            id="about-edit-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
          >
            {/* Bio / Haqqında */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Haqqında (bio)
              </label>
              <textarea
                name="description"
                value={editForm.description || ""}
                onChange={handleEditChange}
                placeholder="Qısa özünüz haqqında məlumat yazın..."
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email daxil edin"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Telefon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="text"
                name="phone_number"
                value={editForm.phone_number || ""}
                onChange={handleEditChange}
                placeholder="Telefon nömrəsi daxil edin"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Doğum tarixi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doğum tarixi
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={editForm.date_of_birth || ""}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cins
              </label>
              <select
                name="gender"
                value={editForm.gender}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Kişi</option>
                <option value="female">Qadın</option>
              </select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
          >
            Ləğv et
          </button>
          <button
            type="submit"
            form="about-edit-form"
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      {/* Edit Image Modal */}
      <Modal
        isOpen={activeModal === "image"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Profil şəklini redaktə et</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <form
            id="image-edit-form"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
          >
            {/* Profil Fotoğrafı */}
            <div className="flex flex-col items-center gap-6">
              <Image
                src={
                  croppedImage
                    ? URL.createObjectURL(croppedImage)
                    : profile.image || "/user.png"
                }
                alt="Profil şəkli"
                width={220}
                height={220}
                className="w-56 h-56 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="flex flex-row items-center justify-center gap-3 mt-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Dəyişdir</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImageToCrop(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleEditCurrentImage}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Crop className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Kəsmək</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer hover:bg-red-100 border border-red-200"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Sil</span>
                </button>
              </div>
            </div>

            {/* Cover Photo (qaldırıldı) */}
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"

            onClick={handleImageSave}
          >
            {isSaving ? "Yüklənir..." : "Yadda saxla"}
          </button>
        </ModalFooter>
      </Modal>

      {/* Edit Background Image Modal */}
      <Modal
        isOpen={activeModal === "background"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Arxa plan şəklini dəyiş</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <form id="background-edit-form" className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              {selectedBackground && (
                <Image
                  src={selectedBackground}
                  alt="Arxa plan şəkli"
                  width={400}
                  height={160}
                  className="w-full max-w-xl h-40 object-cover rounded-xl border-4 border-white shadow-lg"
                />
              )}
              {/* ModalBody-da təklif olunan şəkillər: */}

              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => backgroundInputRef.current?.click()}
              >
                <Camera className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Yeni şəkil seç
                </span>
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={backgroundInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setBackgroundToCrop(e.target.files[0]);
                  }
                }}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"

            onClick={() => {
              if (croppedBackground) handleBackgroundSave(croppedBackground);
            }}
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      {/* Arxa Plan Önizləmə Modalı */}
      <Modal
        isOpen={showBackgroundPreview}
        onOpenChange={() => setShowBackgroundPreview(false)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Arxa plan şəklini dəyiş</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center gap-6">
            {/* "Yeni şəkil seç" düyməsi daha nəzərəçarpacaq və yuxarıda, amma daha sadə */}
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition mt-2"
              onClick={() => {
                setShowBackgroundPreview(false);
                setActiveModal("background");
                setTimeout(() => backgroundInputRef.current?.click(), 0);
              }}
            >
              Yeni şəkil seç
            </button>
            <div className="w-full max-w-xl">
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Seçilmiş arxa plan şəkli
              </label>
              <Image
                src={selectedBackground || "/dashboard/profile/default-bg.jpg"}
                alt="Arxa plan şəkli"
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded-xl border-4 border-white shadow-lg"
              />
            </div>
            <div className="w-full mt-4">
              <div className="font-semibold text-gray-700 mt-2 text-lg">
                Tövsiyə olunan arxa planlar
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedBackgrounds.map((bg, idx) => (
                  <button
                    key={bg}
                    type="button"
                    className={`w-full focus:outline-none ${
                      selectedBackground === bg ? "ring-4 ring-blue-500" : ""
                    }`}
                    title={`Tövsiyə olunan arxa plan ${idx + 1}`}
                    onClick={() => setSelectedBackground(bg)}
                  >
                    <Image
                      src={bg}
                      alt={`Tövsiyə olunan arxa plan ${idx + 1}`}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded-2xl border-4 border-gray-200 hover:border-blue-400 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setShowBackgroundPreview(false)}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
            disabled={
              !selectedBackground ||
              selectedBackground === profile.background_image
            }
            onClick={async () => {
              if (
                !selectedBackground ||
                selectedBackground === profile.background_image
              )
                return;
              setIsLoading(true);
              try {
                let base64Image = "";
                if (selectedBackground.startsWith("data:")) {
                  base64Image = selectedBackground;
                } else {
                  const response = await fetch(selectedBackground);
                  const blob = await response.blob();
                  base64Image = await convertFileToBase64(
                    new File([blob], "selected-bg.jpg", { type: blob.type })
                  );
                }
                const userUpdateData: UserUpdateRequest = {
                  user_profile: { background_image: base64Image },
                };
                await updateUserService(user.id, userUpdateData);
                const userResponse = await getProfileService({ id: user.id });
                console.log(userResponse);
                setUser(userResponse.data);
                setUserCookie(userResponse.data);
                setShowBackgroundPreview(false);
              } catch (error) {
                console.error("Arxa plan yenilənmədi:", error);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      {/* Edit Education Modal */}
      <Modal
        isOpen={activeModal === "education"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Təhsil əlavə et / redaktə et</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <p className="text-gray-500 mb-4">
            Aşağıda təhsil məlumatlarınızı əlavə edin və ya mövcud olanları
            redaktə edin.
          </p>
          {/* Mevcut eğitimler listesi */}
          {educations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mt-2 text-gray-800">
                Təhsil siyahısı
              </h4>
              <ul className="space-y-2">
                {educations.map((edu, idx) => (
                  <li
                    key={edu.id || idx}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                  >
                    <span className="mr-2 font-bold">{idx + 1}.</span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        🏫
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {edu.institution}
                        </div>
                        <div className="text-xs text-gray-600">
                          {edu.started_year} -{" "}
                          {edu.finished_year === 0 ? "İndi" : edu.finished_year}
                        </div>
                        <div className="text-xs text-gray-500">
                          {edu.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 px-1"
                        disabled={idx === 0}
                        title="Yuxarı hərəkət et"
                        onClick={() => {
                          if (idx === 0) return;
                          setEducations((list) => {
                            const newList = [...list];
                            [newList[idx - 1], newList[idx]] = [
                              newList[idx],
                              newList[idx - 1],
                            ];
                            return newList;
                          });
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 px-1"
                        disabled={idx === educations.length - 1}
                        title="Aşağı hərəkət et"
                        onClick={() => {
                          if (idx === educations.length - 1) return;
                          setEducations((list) => {
                            const newList = [...list];
                            [newList[idx], newList[idx + 1]] = [
                              newList[idx + 1],
                              newList[idx],
                            ];
                            return newList;
                          });
                        }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700 font-bold"
                        onClick={() => {
                          setEditEducationIndex(idx);
                          setEducationForm({
                            institution: edu.institution || "",
                            started_year: edu.started_year
                              ? edu.started_year.toString()
                              : "",
                            finished_year: edu.finished_year
                              ? edu.finished_year.toString()
                              : "",
                            description: edu.description || "",
                          });
                          setAddEducationModalOpen(true);
                        }}
                      >
                        Editlə
                      </button>
                      <button
                        type="button"
                        className="ml-4 text-red-500 hover:text-red-700 font-bold"
                        onClick={() =>
                          setEducations((list) =>
                            list.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all"
              onClick={() => setAddEducationModalOpen(true)}
            >
              <PlusCircle className="w-5 h-5" />
              Təhsil əlavə et
            </button>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"

            onClick={async () => {
              setIsEducationSaving(true);
              setIsLoading(true);
              try {
                const userUpdateData: UserUpdateRequest = {
                  user_profile: {
                    educations: educations,
                  },
                };
                await updateUserService(user.id, userUpdateData);
                const userResponse = await getProfileService({ id: user.id });
                setUser(userResponse.data);
                setUserCookie(userResponse.data);
                setActiveModal(null);
              } catch (error) {
                console.error("Təhsil əlavə/redaktə edilə bilmədi:", error);
              } finally {
                setIsEducationSaving(false);
                setIsLoading(false);
              }
            }}
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      {/* Düzenle Modalı */}
      {activeEducationModal && activeEducationModal.type === "edit" && (
        <Modal
          isOpen
          onOpenChange={() => setActiveEducationModal(null)}
          size="lg"
          className="max-h-[90vh] overflow-y-auto flex flex-col"
        >
          <ModalHeader>Təhsili redaktə et</ModalHeader>
          <ModalBody>
            {/* React Hook Form for edit */}
            <EducationForm
              defaultValues={(() => {
                const edu = educations.find(
                  (e) => e.id === activeEducationModal.id
                );
                return edu
                  ? {
                      institution: edu.institution ?? "",
                      started_year:
                        edu.started_year !== undefined
                          ? String(edu.started_year)
                          : "",
                      finished_year:
                        edu.finished_year !== undefined
                          ? String(edu.finished_year)
                          : "",
                      description: edu.description ?? "",
                    }
                  : {
                      institution: "",
                      started_year: "",
                      finished_year: "",
                      description: "",
                    };
              })()}
              onSubmit={(values) => {
                if (typeof activeEducationModal?.id === "number") {
                  setEducations((list) =>
                    list.map((edu, idx) =>
                      idx === activeEducationModal.id
                        ? {
                            ...edu,
                            institution: values.institution,
                            started_year: Number(values.started_year),
                            finished_year: Number(values.finished_year),
                            description: values.description,
                          }
                        : edu
                    )
                  );
                } else {
                  setEducations((list) =>
                    list.map((edu) =>
                      edu.id === activeEducationModal.id
                        ? {
                            ...edu,
                            institution: values.institution,
                            started_year: Number(values.started_year),
                            finished_year: Number(values.finished_year),
                            description: values.description,
                          }
                        : edu
                    )
                  );
                }
                setActiveEducationModal(null);
              }}
              onCancel={() => setActiveEducationModal(null)}
              yearOptions={yearOptions}
            />
          </ModalBody>
        </Modal>
      )}
      {/* Sil Modalı */}
      {activeEducationModal && activeEducationModal.type === "delete" && (
        <Modal
          isOpen
          onOpenChange={() => setActiveEducationModal(null)}
          size="sm"
        >
          <ModalHeader>Təhsil sil</ModalHeader>
          <ModalBody>
            Bu təhsil məlumatını silmək istədiyinizə əminsiniz?
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={() => setActiveEducationModal(null)}
            >
              Ləğv et
            </button>
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setEducations((list) =>
                  list.filter((edu) => edu.id !== activeEducationModal.id)
                );
                setActiveEducationModal(null);
              }}
            >
              Sil
            </button>
          </ModalFooter>
        </Modal>
      )}
      {/* Yeni Təhsil Əlavə Et Modalı */}
      {addEducationModalOpen && (
        <Modal
          isOpen
          onOpenChange={() => {
            setAddEducationModalOpen(false);
            setEditEducationIndex(null); // Reset index on close
          }}
          size="lg"
          className="max-h-[90vh] overflow-y-auto flex flex-col"
        >
          <ModalHeader>
            {editEducationIndex !== null ? "Təhsili redaktə et" : "Yeni təhsil əlavə et"}
          </ModalHeader>
          <ModalBody>
            <EducationForm
              defaultValues={educationForm}
              onSubmit={(values) => {
                if (editEducationIndex !== null) {
                  // Update existing education
                  setEducations((list) =>
                    list.map((edu, index) =>
                      index === editEducationIndex
                        ? { ...edu, ...values, started_year: Number(values.started_year), finished_year: Number(values.finished_year) }
                        : edu
                    )
                  );
                } else {
                  // Add new education
                  setEducations((list) => [
                    ...list,
                    {
                      id:
                        "tmp-" +
                        Date.now() +
                        "-" +
                        Math.floor(Math.random() * 100000),
                      institution: values.institution,
                      started_year: Number(values.started_year),
                      finished_year: Number(values.finished_year),
                      description: values.description,
                      profile: user.user_profile.id,
                    },
                  ]);
                }
                setAddEducationModalOpen(false);
                setEditEducationIndex(null); // Reset index
              }}
              onCancel={() => {
                setAddEducationModalOpen(false);
                setEditEducationIndex(null); // Reset index on cancel
              }}
              yearOptions={yearOptions}
            />
          </ModalBody>
        </Modal>
      )}

      {/* Experience Modal */}
      <Modal
        isOpen={activeModal === "experience"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Təcrübə əlavə et / redaktə et</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <p className="text-gray-500 mb-4">
            Aşağıda təcrübə məlumatlarınızı əlavə edin və ya mövcud olanları
            redaktə edin.
          </p>
          {experiences.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mt-2 text-gray-800">
                Təcrübə siyahısı
              </h4>
              <ul className="space-y-2">
                {experiences.map((exp, idx) => (
                  <li
                    key={exp.id || idx}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                  >
                    <span className="mr-2 font-bold">{idx + 1}.</span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        💼
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {exp.institution}
                        </div>
                        <div className="text-xs text-gray-600">
                          {exp.started_year} -{" "}
                          {exp.finished_year === 0 ? "İndi" : exp.finished_year}
                        </div>
                        <div className="text-xs text-gray-500">
                          {exp.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 px-1"
                        disabled={idx === 0}
                        title="Yuxarı hərəkət et"
                        onClick={() => {
                          if (idx === 0) return;
                          setExperiences((list) => {
                            const newList = [...list];
                            [newList[idx - 1], newList[idx]] = [
                              newList[idx],
                              newList[idx - 1],
                            ];
                            return newList;
                          });
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 px-1"
                        disabled={idx === experiences.length - 1}
                        title="Aşağı hərəkət et"
                        onClick={() => {
                          if (idx === experiences.length - 1) return;
                          setExperiences((list) => {
                            const newList = [...list];
                            [newList[idx], newList[idx + 1]] = [
                              newList[idx + 1],
                              newList[idx],
                            ];
                            return newList;
                          });
                        }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700 font-bold"
                        onClick={() => {
                          setEditExperienceIndex(idx);
                          setExperienceForm({
                            company: exp.institution || "",
                            started_year: exp.started_year
                              ? exp.started_year.toString()
                              : "",
                            finished_year: exp.finished_year
                              ? exp.finished_year.toString()
                              : "",
                            description: exp.description || "",
                          });
                        }}
                      >
                        Editlə
                      </button>
                      <button
                        type="button"
                        className="ml-4 text-red-500 hover:text-red-700 font-bold"
                        onClick={() =>
                          setExperiences((list) =>
                            list.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all"
              onClick={() => setAddExperienceModalOpen(true)}
            >
              <PlusCircle className="w-5 h-5" />
              Təcrübə əlavə et
            </button>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"

            onClick={async () => {
              setIsExperienceSaving(true);
              try {
                const userUpdateData: UserUpdateRequest = {
                  user_profile: {
                    experiences: experiences,
                  },
                };
                await updateUserService(user.id, userUpdateData);
                const userResponse = await getProfileService({ id: user.id });
                setUser(userResponse.data);
                setUserCookie(userResponse.data);
                setActiveModal(null);
              } catch (error) {
                console.error("Təcrübə əlavə/redaktə edilə bilmədi:", error);
              } finally {
                setIsExperienceSaving(false);
              }
            }}
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={activeModal === "be_freelancer"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Freelancer Profilini Aktiv Et</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <div className="mb-4 p-4 border border-blue-100 rounded-lg bg-blue-50 text-blue-800 text-sm">
            Freelancer rejimini aktiv etdikdə profiliniz freelancər kimi
            görünəcək. Bu, iş imkanlarınızı artırmaq üçün istifadə olunur.
          </div>
          <form
            id="freelancer-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleFreelancerSave();
            }}
          >
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Freelancer rejimini aktiv et
              </label>
              <ToggleSwitch
                checked={isFreelancer}
                onCheckedChange={setIsFreelancer}
                size="md"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
            disabled={isFreelancerSaving}
          >
            Ləğv et
          </button>
          <button
            type="submit"
            form="freelancer-form"
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"

          >
            {isFreelancerSaving ? "Yüklənir..." : "Yadda saxla"}
          </button>
        </ModalFooter>
      </Modal>

      {/* Edit Experience Modal */}
      {editExperienceIndex !== null && (
        <Modal
          isOpen
          onOpenChange={() => {
            setEditExperienceIndex(null);
            setExperienceForm({
              company: "",
              started_year: "",
              finished_year: "",
              description: "",
            });
          }}
          size="lg"
          className="max-h-[90vh] overflow-y-auto flex flex-col"
        >
          <ModalHeader>Əlavə ediləcək təcrübəni redaktə et</ModalHeader>
          <ModalBody>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirkət
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={experienceForm.company}
                    onChange={(e) =>
                      setExperienceForm((f) => ({
                        ...f,
                        company: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Şirkət adı"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlanğıc ili
                    </label>
                    <select
                      name="started_year"
                      value={experienceForm.started_year}
                      onChange={(e) =>
                        setExperienceForm((f) => ({
                          ...f,
                          started_year: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçin</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitmə ili
                    </label>
                    <select
                      name="finished_year"
                      value={experienceForm.finished_year}
                      onChange={(e) =>
                        setExperienceForm((f) => ({
                          ...f,
                          finished_year: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçin</option>
                      <option value="0">İndi</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıqlama
                  </label>
                  <textarea
                    name="description"
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qısa açıqlama (işin mahiyyəti və s.)"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => {
                  setEditExperienceIndex(null);
                  setExperienceForm({
                    company: "",
                    started_year: "",
                    finished_year: "",
                    description: "",
                  });
                }}
              >
                Ləğv et
              </button>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setExperiences((list) =>
                    list.map((exp, i) =>
                      i === editExperienceIndex
                        ? {
                            ...exp,
                            institution: experienceForm.company,
                            started_year: Number(experienceForm.started_year),
                            finished_year: Number(experienceForm.finished_year),
                            description: experienceForm.description,
                          }
                        : exp
                    )
                  );
                  setEditExperienceIndex(null);
                  setExperienceForm({
                    company: "",
                    started_year: "",
                    finished_year: "",
                    description: "",
                  });
                }}
              >
                Yadda saxla
              </button>
            </div>
          </ModalBody>
        </Modal>
      )}
      {/* Yeni Təcrübə Əlavə Et Modalı */}
      {addExperienceModalOpen && (
        <Modal
          isOpen
          onOpenChange={() => setAddExperienceModalOpen(false)}
          size="lg"
          className="max-h-[90vh] overflow-y-auto flex flex-col"
        >
          <ModalHeader>Yeni təcrübə əlavə et</ModalHeader>
          <ModalBody>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirkət
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={experienceForm.company}
                    onChange={(e) =>
                      setExperienceForm((f) => ({
                        ...f,
                        company: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Şirkət adı"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlanğıc ili
                    </label>
                    <select
                      name="started_year"
                      value={experienceForm.started_year}
                      onChange={(e) =>
                        setExperienceForm((f) => ({
                          ...f,
                          started_year: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçin</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitmə ili
                    </label>
                    <select
                      name="finished_year"
                      value={experienceForm.finished_year}
                      onChange={(e) =>
                        setExperienceForm((f) => ({
                          ...f,
                          finished_year: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçin</option>
                      <option value="0">İndi</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıqlama
                  </label>
                  <textarea
                    name="description"
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qısa açıqlama (işin mahiyyəti və s.)"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => {
                  setAddExperienceModalOpen(false);
                  setExperienceForm({
                    company: "",
                    started_year: "",
                    finished_year: "",
                    description: "",
                  });
                }}
              >
                Ləğv et
              </button>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setExperiences((list) => [
                    ...list,
                    {
                      id: Date.now() + Math.floor(Math.random() * 100000), // <-- numeric id
                      institution: experienceForm.company,
                      started_year: Number(experienceForm.started_year),
                      finished_year: Number(experienceForm.finished_year),
                      description: experienceForm.description,
                      profile: user.user_profile.id,
                    },
                  ]);
                  setAddExperienceModalOpen(false);
                  setExperienceForm({
                    company: "",
                    started_year: "",
                    finished_year: "",
                    description: "",
                  });
                }}
              >
                Yadda saxla
              </button>
            </div>
          </ModalBody>
        </Modal>
      )}

      {imageToCrop && (
        <ImageCropModal
          isOpen={!!imageToCrop}
          onClose={() => setImageToCrop(null)}
          image={imageToCrop}
          onCrop={onCrop}
          aspectRatio={1}
        />
      )}
      {backgroundToCrop && (
        <ImageCropModal
          isOpen={!!backgroundToCrop}
          onClose={() => {
            setBackgroundToCrop(null);
            setActiveModal(null);
          }}
          image={backgroundToCrop}
          onCrop={onBackgroundCrop}
          cropWidth={800}
          cropHeight={320}
        />
      )}

      {/* Skills Modal */}
      <Modal
        isOpen={activeSkillsModal}
        onOpenChange={() => setActiveSkillsModal(false)}
        size="sm"
        className="max-h-[90vh] flex flex-col"
      >
        <ModalHeader>Bacarıqlar</ModalHeader>
        <ModalBody>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Yeni bacarıq əlavə et..."
            />
            <button
              type="button"
              className={`px-4 py-2 rounded-full text-white text-sm font-semibold transition ${
                newSkill.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!newSkill.trim()}
              onClick={() => {
                if (newSkill.trim()) {
                  setSkills((list) => [
                    ...list,
                    {
                      id: Date.now(),
                      name: newSkill,
                      profile: user.user_profile.id,
                    },
                  ]);
                  setNewSkill("");
                }
              }}
            >
              Əlavə et
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={skill.id || idx}
                className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm"
              >
                {editingSkillIndex === idx ? (
                  <>
                    <input
                      type="text"
                      value={editingSkillValue}
                      onChange={(e) => setEditingSkillValue(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-0.5 text-sm mr-2"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-800 font-bold mr-1"
                      onClick={() => {
                        setSkills((list) =>
                          list.map((s, i) =>
                            i === idx ? { ...s, name: editingSkillValue } : s
                          )
                        );
                        setEditingSkillIndex(null);
                        setEditingSkillValue("");
                      }}
                      aria-label="Yadda saxla"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 font-bold"
                      onClick={() => {
                        setEditingSkillIndex(null);
                        setEditingSkillValue("");
                      }}
                      aria-label="Ləğv et"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    {skill.name}
                    <button
                      type="button"
                      className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                      onClick={() => {
                        setEditingSkillIndex(idx);
                        setEditingSkillValue(skill.name);
                      }}
                      aria-label="Editlə"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                      onClick={() =>
                        setSkills((list) => list.filter((_, i) => i !== idx))
                      }
                      aria-label="Sil"
                    >
                      ×
                    </button>
                  </>
                )}
              </span>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2 border-t pt-4 bg-gray-50">
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            onClick={() => setActiveSkillsModal(false)}
          >
            Bağla
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={async () => {
              try {
                setIsLoading(true);
                // 'skills' property is not valid in user_profile, so we need to send skills separately
                const userUpdateData: UserUpdateRequest = {
                  user_profile: {
                    // other updatable fields can go here if needed
                    skills: skills.map((skill) => ({
                      id: skill.id,
                      name: skill.name,
                    })),
                  },
                };
                await updateUserService(user.id, userUpdateData);
                const userResponse = await getProfileService({ id: user.id });
                setUser(userResponse.data);
                setUserCookie(userResponse.data);
                setActiveSkillsModal(false);
              } catch (error) {
                // Xəta mesajı göstərin
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      {/* Languages Modal */}
      <Modal
        isOpen={activeLanguagesModal}
        onOpenChange={() => setActiveLanguagesModal(false)}
        size="md"
        className="max-h-[90vh] flex flex-col"
      >
        <ModalHeader>Dillər</ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newLanguage.name}
                onChange={(e) =>
                  setNewLanguage((l) => ({ ...l, name: e.target.value }))
                }
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Dil adı (məs. İngilis)"
              />
              <input
                type="text"
                value={newLanguage.level}
                onChange={(e) =>
                  setNewLanguage((l) => ({ ...l, level: e.target.value }))
                }
                className="w-32 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Səviyyə (məs. B2)"
              />
              <button
                type="button"
                className={`px-4 py-2 rounded-full text-white text-sm font-semibold transition ${
                  newLanguage.name.trim() && newLanguage.level.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!newLanguage.name.trim() || !newLanguage.level.trim()}
                onClick={() => {
                  if (newLanguage.name.trim() && newLanguage.level.trim()) {
                    setLanguages((list) => [
                      ...list,
                      {
                        id: Date.now(),
                        level: newLanguage.level,
                        language: { id: -Date.now(), name: newLanguage.name },
                        user_profile: user.user_profile.id,
                      },
                    ]);
                    setNewLanguage({ name: "", level: "" });
                  }
                }}
              >
                Əlavə et
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <span
                  key={lang.id || idx}
                  className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm"
                >
                  {editingLanguageIndex === idx ? (
                    <>
                      <input
                        type="text"
                        value={editingLanguage.name}
                        onChange={(e) =>
                          setEditingLanguage((l) => ({
                            ...l,
                            name: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm mr-2"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editingLanguage.level}
                        onChange={(e) =>
                          setEditingLanguage((l) => ({
                            ...l,
                            level: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm mr-2"
                        placeholder="Səviyyə"
                      />
                      <button
                        type="button"
                        className="text-green-600 hover:text-green-800 font-bold mr-1"
                        onClick={() => {
                          setLanguages((list) =>
                            list.map((l, i) =>
                              i === idx
                                ? {
                                    ...l,
                                    level: editingLanguage.level,
                                    language: {
                                      id: l.language?.id ?? -Date.now(),
                                      name: editingLanguage.name,
                                    },
                                  }
                                : l
                            )
                          );
                          setEditingLanguageIndex(null);
                          setEditingLanguage({ name: "", level: "" });
                        }}
                        aria-label="Yadda saxla"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500 font-bold"
                        onClick={() => {
                          setEditingLanguageIndex(null);
                          setEditingLanguage({ name: "", level: "" });
                        }}
                        aria-label="Ləğv et"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      {lang.language?.name} ({lang.level})
                      <button
                        type="button"
                        className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                        onClick={() => {
                          setEditingLanguageIndex(idx);
                          setEditingLanguage({
                            name: lang.language?.name,
                            level: lang.level,
                          });
                        }}
                        aria-label="Editlə"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                        onClick={() =>
                          setLanguages((list) =>
                            list.filter((_, i) => i !== idx)
                          )
                        }
                        aria-label="Sil"
                      >
                        ×
                      </button>
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2 border-t pt-4 bg-gray-50">
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            onClick={() => setActiveLanguagesModal(false)}
          >
            Bağla
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={async () => {
              try {
                setIsLoading(true);
                const userUpdateData: UserUpdateRequest = {
                  user_profile: {
                    user_languages: languages.map((lang) => ({
                      id: lang.id,
                      language: { name: lang.language?.name || "" },
                      level: lang.level,
                    })),
                  },
                };
                console.log(userUpdateData);
                await updateUserService(user.id, userUpdateData);
                const userResponse = await getProfileService({ id: user.id });
                setUser(userResponse.data);
                setUserCookie(userResponse.data);
                setActiveLanguagesModal(false);
              } catch (error) {
                // Xəta mesajı göstərin
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Yadda saxla
          </button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={activeModal === "salary"}
        onOpenChange={() => setActiveModal(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <ModalHeader>Xidmət haqqını redaktə et</ModalHeader>
        <ModalBody className="flex-1 overflow-y-auto">
          <div className="mb-4 text-gray-700 text-sm">
            Burada xidmət haqqınızı əlavə və ya redaktə edə bilərsiniz. "Aylıq",
            "Layihə" və ya "Paket" əsaslı qiymətləri daxil edin.
          </div>
          {/* Salary List */}
          {salaries.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mt-2 text-gray-800">
                Xidmət haqqı siyahısı
              </h4>
              <ul className="space-y-2">
                {salaries.map((salary, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                  >
                    <div className="flex-1 flex gap-4 items-center">
                      <span className="font-bold">
                        {salary.salary_type === "monthly"
                          ? "Aylıq"
                          : salary.salary_type === "project_based"
                          ? "Layihə"
                          : "Paket"}
                      </span>
                      <span>{salary.amount} AZN</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          salary.is_visible
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {salary.is_visible ? "Görünür" : "Gizli"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700 font-bold"
                        onClick={() => {
                          setEditSalaryIndex(idx);
                          setSalaryForm({
                            salary_type: salary.salary_type,
                            amount: salary.amount.toString(),
                            is_visible: salary.is_visible,
                          });
                        }}
                      >
                        Editlə
                      </button>
                      <button
                        type="button"
                        className="ml-4 text-red-500 hover:text-red-700 font-bold"
                        onClick={() =>
                          setSalaries((list) =>
                            list.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Add/Edit Salary Form */}
          <div className="border-t pt-4 mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSalaryError(null);
                if (
                  salaryForm.amount === "" ||
                  isNaN(Number(salaryForm.amount))
                )
                  return;
                // Prevent duplicate salary_type
                const duplicate = salaries.find(
                  (s, i) =>
                    s.salary_type === salaryForm.salary_type &&
                    i !== editSalaryIndex
                );
                if (duplicate) {
                  setSalaryError("Bu tip xidmət haqqı artıq mövcuddur.");
                  return;
                }
                const newSalary = {
                  salary_type: salaryForm.salary_type,
                  amount: Number(salaryForm.amount),
                  is_visible: salaryForm.is_visible,
                  profile: user.user_profile.id,
                };
                if (editSalaryIndex !== null) {
                  setSalaries((list) =>
                    list.map((s, i) => (i === editSalaryIndex ? newSalary : s))
                  );
                  setEditSalaryIndex(null);
                } else {
                  setSalaries((list) => [...list, newSalary]);
                }
                setSalaryForm({
                  salary_type: "monthly",
                  amount: "",
                  is_visible: true,
                });
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tip
                  </label>
                  <select
                    value={salaryForm.salary_type}
                    onChange={(e) =>
                      setSalaryForm((f) => ({
                        ...f,
                        salary_type: e.target.value as
                          | "monthly"
                          | "project_based"
                          | "package_based",
                      }))
                    }
                    className="border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="monthly">Aylıq</option>
                    <option value="project_based">Layihə</option>
                    <option value="package_based">Paket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Məbləğ (AZN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={salaryForm.amount}
                    onChange={(e) =>
                      setSalaryForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    className="border border-gray-200 rounded px-2 py-1 w-28"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    checked={salaryForm.is_visible}
                    onChange={(e) =>
                      setSalaryForm((f) => ({
                        ...f,
                        is_visible: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-xs">Görünür</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {editSalaryIndex !== null && (
                  <button
                    type="button"
                    className="bg-gray-200 px-3 py-1 rounded"
                    onClick={() => {
                      setEditSalaryIndex(null);
                      setSalaryForm({
                        salary_type: "monthly",
                        amount: "",
                        is_visible: true,
                      });
                    }}
                  >
                    Ləğv et
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {editSalaryIndex !== null ? "Yadda saxla" : "Əlavə et"}
                </button>
              </div>
            </form>
          </div>
          {salaryError && (
            <div className="text-red-500 text-xs mt-1">{salaryError}</div>
          )}
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2 py-4">
          <button
            type="button"
            className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setActiveModal(null)}
            disabled={isSalarySaving}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"

            onClick={async () => {
              setIsSalarySaving(true);
              setIsLoading(true);
              try {
                const userUpdateData: UserUpdateRequest = {
                  user_profile: {
                    salaries: salaries,
                  },
                };
                await updateUserService(user.id, userUpdateData);
                const userResponse = await getProfileService({ id: user.id });
                setUser(userResponse.data);
                setUserCookie(userResponse.data);
                setActiveModal(null);
              } catch (error) {
                // handle error
              } finally {
                setIsSalarySaving(false);
                setIsLoading(false);
              }
            }}
          >
            {isSalarySaving ? "Yüklənir..." : "Yadda saxla"}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

// EducationForm component
interface EducationFormProps {
  defaultValues: EducationFormType;
  onSubmit: (values: EducationFormType) => void;
  onCancel: () => void;
  yearOptions: string[];
}
function EducationForm({
  defaultValues,
  onSubmit,
  onCancel,
  yearOptions,
}: EducationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EducationFormType>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  });
  // Reset form when defaultValues change
  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Təhsil müəssisəsi
            </label>
            <input
              type="text"
              {...register("institution")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Məktəb və ya universitet adı"
            />
            {errors.institution && (
              <p className="text-red-500 text-xs mt-1">
                {errors.institution.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlanğıc ili
              </label>
              <select
                {...register("started_year")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçin</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.started_year && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.started_year.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bitmə ili
              </label>
              <select
                {...register("finished_year")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçin</option>
                <option value="0">İndi</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.finished_year && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.finished_year.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıqlama
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Qısa açıqlama (fakültə, ixtisas və s.)"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Ləğv et
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Yadda saxla
        </button>
      </div>
    </form>
  );
}

export default OwnerPage;
