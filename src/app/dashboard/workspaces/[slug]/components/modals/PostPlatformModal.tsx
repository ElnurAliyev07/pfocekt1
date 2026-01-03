import { Modal, Button } from "@/components/ui";
import { useDisclosure } from "@/components/ui/modal";
import { useState, useEffect } from "react";
import CustomCheckbox from "@/components/ui/form/input/CustomCheckbox";
import Image from "next/image";
import { KeyLabel } from "@/types/keyLabel.type";
import { 
    SocialMediaPlatform, 
    ContentType, 
    PLATFORM_CONFIGS, 
    CONTENT_TYPE_CONFIGS,
    getPlatformContentTypes
} from "@/types/social-media.type";
import DatePicker from "@/components/ui/form/input/NewDateTimePicker";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export interface PlatformLocation {
    platform: SocialMediaPlatform;
    icon: string;
    locations: {
        id: ContentType;
        name: string;
        selected: boolean;
        scheduled_date: string | null;
    }[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (locations: PlatformLocation[]) => void;
    postId: number;
    selectedPlatforms: KeyLabel[];
    initialSelectedLocations?: PlatformLocation[];
    planningId: number;
    is_publishable?: boolean; // New prop for publishable state
    onPublishableChange?: (value: boolean) => void; // Callback for publishable toggle
}

// Helper to get all platform keys from platformConfigs
const ALL_PLATFORM_KEYS: SocialMediaPlatform[] = Object.keys(PLATFORM_CONFIGS) as SocialMediaPlatform[];

const platformConfigs: Record<SocialMediaPlatform, { icon: string; locations: { id: ContentType; name: string }[] }> = {
    instagram: {
        icon: "/icons/instagram.svg",
        locations: [
            { id: "post", name: "Post" },
            { id: "story", name: "Story" },
            { id: "reels", name: "Reels" },
            { id: "carousel", name: "Carousel" }
        ]
    },
    facebook: {
        icon: "/icons/facebook.svg",
        locations: [
            { id: "post", name: "Post" },
            { id: "story", name: "Story" },
            { id: "video", name: "Video" }
        ]
    },
    tiktok: {
        icon: "/icons/tiktok.svg",
        locations: [
            { id: "video", name: "Video" },
            { id: "short", name: "Short" }
        ]
    },
    youtube: {
        icon: "/icons/youtube.svg",
        locations: [
            { id: "video", name: "Video" },
            { id: "short", name: "Short" }
        ]
    }
};

const PostPlatformModal: React.FC<Props> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    postId, 
    selectedPlatforms,
    initialSelectedLocations = [],
    planningId,
    is_publishable,
    onPublishableChange
}) => {
    const [selectedLocations, setSelectedLocations] = useState<PlatformLocation[]>([]);
    const [expandedPlatform, setExpandedPlatform] = useState<SocialMediaPlatform | null>(null);

    useEffect(() => {
        if (isOpen) {
            // If is_publishable is false, show all platforms, not just selectedPlatforms
            let platformsToShow: SocialMediaPlatform[];
            if (is_publishable === false) {
                platformsToShow = ALL_PLATFORM_KEYS;
            } else {
                platformsToShow = selectedPlatforms.map(platform => platform.key.toLowerCase() as SocialMediaPlatform);
            }

            // Load all locations for each platform and mark selected ones
            const initialLocations = platformsToShow.map(platformKey => {
                const config = platformConfigs[platformKey];
                // Düzeltme: her iki tarafı da küçük harfe çevir
                const existingPlatform = initialSelectedLocations.find(p => 
                    p.platform.toLowerCase() === platformKey.toLowerCase());
                
                if (!config) {
                    return null;
                }
                
                return {
                    platform: platformKey,
                    icon: config.icon,
                    locations: config.locations.map(loc => {
                        // If previous selections exist for this platform, maintain selected state and scheduled date
                        const existingLocation = existingPlatform?.locations.find(l => l.id === loc.id);
                        return {
                            ...loc,
                            selected: existingLocation?.selected || false,
                            scheduled_date: existingLocation?.scheduled_date || null
                        };
                    })
                };
            }).filter(Boolean) as PlatformLocation[];
            
            setSelectedLocations(initialLocations);
        }
    }, [isOpen, selectedPlatforms, initialSelectedLocations, is_publishable]);

    const handleLocationToggle = (platform: SocialMediaPlatform, locationId: ContentType) => {
        setSelectedLocations(prev => 
            prev.map(p => {
                if (p.platform === platform) {
                    return {
                        ...p,
                        locations: p.locations.map(loc => 
                            loc.id === locationId ? { ...loc, selected: !loc.selected, scheduled_date: loc.scheduled_date } : loc
                        )
                    };
                }
                return p;
            })
        );
    };

    const handleScheduleDateChange = (platform: SocialMediaPlatform, locationId: ContentType, date: string | null) => {
        setSelectedLocations(prev => 
            prev.map(p => {
                if (p.platform === platform) {
                    return {
                        ...p,
                        locations: p.locations.map(loc => 
                            loc.id === locationId ? { ...loc, scheduled_date: date } : loc
                        )
                    };
                }
                return p;
            })
        );
    };

    const handleSave = () => {
        const allPlatforms = selectedLocations.map(platform => ({
            ...platform,
            locations: platform.locations
        }));
        
        onSave(allPlatforms);
        onClose();
    };

    const togglePlatform = (platform: SocialMediaPlatform) => {
        setExpandedPlatform(expandedPlatform === platform ? null : platform);
    };

    const getSelectedCount = (platform: PlatformLocation) => {
        return platform.locations.filter(loc => loc.selected).length;
    };

    const getSelectedPlatformIcons = () => {
        const selectedPlatforms = selectedLocations
            .filter(platform => platform.locations.some(loc => loc.selected))
            .map(platform => platform.icon);
        return [...new Set(selectedPlatforms)];
    };

    return (
        <Modal.Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <Modal.ModalContent className="w-[90%] max-w-[600px] bg-white rounded-xl shadow-lg">
                <Modal.ModalHeader className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-semibold text-t-black">
                                Paylaşım Yerleri
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Hər platform üçün paylaşım yerlərini seçin
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            {getSelectedPlatformIcons().map((icon, index) => (
                                <Image
                                    key={index}
                                    src={icon}
                                    alt="Platform"
                                    width={24}
                                    height={24}
                                    className="rounded"
                                />
                            ))}
                        </div>
                    </div>
                    {/* Publishable toggle */}
                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm font-medium text-gray-700">Yayımlansın</span>
                        <ToggleSwitch
                            checked={!!is_publishable}
                            onCheckedChange={onPublishableChange}
                            size="sm"
                        />
                    </div>
                </Modal.ModalHeader>
                <Modal.ModalBody className="p-6">
                    {(selectedPlatforms.length === 0 && is_publishable !== false) ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Sosial hesab tapılmadı
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm">
                                Paylaşım yerlərini seçmək üçün əvvəlcə sosial hesablar əlavə etməlisiniz
                            </p>
                            <Button
                                variant="primary"
                                onPress={() => {
                                    onClose();
                                    const workspaceSlug = window.location.pathname.split('/workspaces/')[1]?.split('/')[0];
                                    if (workspaceSlug) {
                                        window.location.href = `/dashboard/workspaces/${workspaceSlug}?tab=planning&contentTab=social_medias&planning=${planningId}`;
                                    }
                                }}
                                className="px-3 py-1 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-all duration-200"
                            >
                                Sosial hesablar əlavə et
                            </Button>
                        </div>
                    ) : (
                    <div className="space-y-4">
                        {selectedLocations.map((platform) => (
                            <div 
                                key={platform.platform} 
                                className="bg-gray-50 rounded-lg overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => togglePlatform(platform.platform)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src={platform.icon}
                                            alt={platform.platform}
                                            width={24}
                                            height={24}
                                            className="rounded"
                                        />
                                        <span className="font-medium text-t-black">
                                            {PLATFORM_CONFIGS[platform.platform].displayName}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {getSelectedCount(platform) > 0 && (
                                            <span className="text-sm text-primary">
                                                {getSelectedCount(platform)} seçildi
                                            </span>
                                        )}
                                        <svg
                                            className={`w-5 h-5 transform transition-transform duration-200 ${
                                                expandedPlatform === platform.platform ? 'rotate-180' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </button>
                                {expandedPlatform === platform.platform && (
                                    <div className="p-4 bg-white border-t border-gray-100">
                                        <div className="grid grid-cols-2 gap-3">
                                            {platform.locations.map((location) => (
                                                <div 
                                                    key={location.id} 
                                                    className={`
                                                        relative flex flex-col p-3 rounded-xl
                                                        ${location.selected
                                                            ? "bg-blue-50 border-2 border-blue-500"
                                                            : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
                                                        }
                                                        transition-all duration-200
                                                    `}
                                                >
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={location.selected}
                                                            onChange={() => handleLocationToggle(platform.platform, location.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`
                                                            w-5 h-5 rounded border-2 flex items-center justify-center
                                                            ${location.selected
                                                                ? "border-blue-500 bg-blue-500"
                                                                : "border-gray-300"
                                                            }
                                                        `}>
                                                            {location.selected && (
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className={`
                                                            text-sm font-medium
                                                            ${location.selected
                                                                ? "text-blue-700"
                                                                : "text-gray-700"
                                                            }
                                                        `}>
                                                            {CONTENT_TYPE_CONFIGS[location.id].displayName}
                                                        </span>
                                                    </label>
                                                    
                                                    {location.selected && (
                                                        <div className="mt-2">
                                                            <DatePicker
                                                                id={`schedule_${platform.platform}_${location.id}`}
                                                                value={location.scheduled_date || ""}
                                                                onChange={(date) => handleScheduleDateChange(platform.platform, location.id, date)}
                                                                label="Planlaşdırma vaxtı"
                                                                disableDatePrevious={new Date()}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 text-sm text-gray-500">
                                            Birdən çox lokasiya seçə bilərsiniz
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    )}
                </Modal.ModalBody>
                <Modal.ModalFooter className="p-4 border-t border-gray-100 flex justify-end space-x-1.5">
                    <Button
                        variant="flat"
                        className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-200"
                        onPress={onClose}
                    >
                        Ləğv et
                    </Button>
                    <Button
                        variant="primary"
                        onPress={handleSave}
                        className="px-3 py-1 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-all duration-200"
                    >
                        Yadda saxla
                    </Button>
                </Modal.ModalFooter>
            </Modal.ModalContent>
        </Modal.Modal>
    );
};

export default PostPlatformModal; 