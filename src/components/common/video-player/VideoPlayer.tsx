'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings
} from 'lucide-react';

// Types
interface VideoSource {
  id: number;
  name: string;
  url: string;
  poster: string;
  duration: string;
  description: string;
  category: string;
  views: string;
  likes: string;
  qualities?: {
    [key: string]: string;
  };
}

interface VideoPlayerProps {
  sources?: VideoSource[];
  initialSource?: VideoSource;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  className?: string;
  onVideoChange?: (video: VideoSource) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

// Custom Hooks
const useVideoPlayer = (sources: VideoSource[], initialSource?: VideoSource) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<VideoSource>(initialSource || sources[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const playVideo = useCallback((index: number) => {
    if (index >= 0 && index < sources.length) {
      setCurrentVideoIndex(index);
      setCurrentVideo(sources[index]);
      setCurrentTime(0);
    }
  }, [sources]);

  const playNext = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % sources.length;
    playVideo(nextIndex);
  }, [currentVideoIndex, sources.length, playVideo]);

  const playPrevious = useCallback(() => {
    const prevIndex = currentVideoIndex === 0 ? sources.length - 1 : currentVideoIndex - 1;
    playVideo(prevIndex);
  }, [currentVideoIndex, sources.length, playVideo]);

  return {
    currentVideo,
    currentVideoIndex,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isBuffering,
    setIsBuffering,
    playVideo,
    playNext,
    playPrevious,
    totalVideos: sources.length
  };
};

const useVideoControls = (videoRef: React.RefObject<HTMLVideoElement | null>, currentVideo: VideoSource) => {
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(currentVideo.url);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(currentVideo.poster || '');

  // Click outside handler for settings menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showSettings && !target.closest('[data-settings-menu]') && !target.closest('[data-settings-button]')) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, [videoRef]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    video.currentTime = newTime;
  }, [videoRef]);

  const toggleFullscreen = useCallback(async () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [videoRef]);

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, [videoRef]);

  const changeQuality = useCallback((newQuality: string) => {
    const video = videoRef.current;
    if (!video) return;

    // Mevcut zamanı kaydet
    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    // Yeni kalite URL'ini belirle
    let newUrl = currentVideo.url;
    
    if (newQuality === 'auto') {
      // Auto kalite için varsayılan URL'i kullan
      newUrl = currentVideo.url;
    } else if (currentVideo.qualities && currentVideo.qualities[newQuality]) {
      // Belirli kalite URL'ini kullan
      newUrl = currentVideo.qualities[newQuality];
    } else {
      // Kalite URL'i yoksa, mevcut URL'i farklı parametrelerle kullan
      try {
        const url = new URL(currentVideo.url);
        url.searchParams.set('quality', newQuality);
        newUrl = url.toString();
      } catch (error) {
        // URL parsing başarısız olursa, basit string manipülasyonu kullan
        const separator = currentVideo.url.includes('?') ? '&' : '?';
        newUrl = `${currentVideo.url}${separator}quality=${newQuality}`;
      }
    }

    // Video kaynağını değiştir
    video.src = newUrl;
    setCurrentVideoUrl(newUrl);
    setQuality(newQuality);

    // Video yüklendiğinde zamanı geri yükle
    const handleLoadedMetadata = () => {
      video.currentTime = currentTime;
      if (wasPlaying) {
        video.play();
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
  }, [videoRef, currentVideo]);

  // Video değiştiğinde URL'i güncelle
  useEffect(() => {
    setCurrentVideoUrl(currentVideo.url);
    setQuality('auto');
    setVideoError(null); // Reset error when video changes
    
    // Eğer poster yoksa, video yüklendiğinde thumbnail oluştur
    if (!currentVideo.poster) {
      setThumbnailUrl('');
    } else {
      setThumbnailUrl(currentVideo.poster);
    }
  }, [currentVideo]);

  // Video'dan thumbnail oluştur
  const generateThumbnail = useCallback(() => {
    const video = videoRef.current;
    if (!video || thumbnailUrl) return; // Eğer zaten thumbnail varsa oluşturma

    const tryGenerateThumbnail = () => {
      if (!video || video.readyState < 2) {
        // Video henüz yüklenmemişse, 100ms sonra tekrar dene
        setTimeout(tryGenerateThumbnail, 100);
        return;
      }

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Video boyutlarını al
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 360;
        
        // Geçerli boyutlar yoksa bekle
        if (videoWidth === 0 || videoHeight === 0) {
          setTimeout(tryGenerateThumbnail, 100);
          return;
        }
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        // Video'nun ilk frame'ini canvas'a çiz
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Canvas'ı data URL'e çevir
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        setThumbnailUrl(thumbnail);
      } catch (error) {
        console.error('Thumbnail oluşturulamadı:', error);
      }
    };

    tryGenerateThumbnail();
  }, [videoRef, thumbnailUrl]);

  return {
    showControls,
    setShowControls,
    isFullscreen,
    showSettings,
    setShowSettings,
    quality,
    playbackRate,
    currentVideoUrl,
    videoError,
    setVideoError,
    thumbnailUrl,
    generateThumbnail,
    togglePlay,
    skip,
    toggleFullscreen,
    changePlaybackRate,
    changeQuality
  };
};

// Utility Functions
const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Settings Menu Component
const SettingsMenu: React.FC<{
  isOpen: boolean;
  quality: string;
  playbackRate: number;
  currentVideo: VideoSource;
  onQualityChange: (quality: string) => void;
  onPlaybackRateChange: (rate: number) => void;
}> = ({ isOpen, quality, playbackRate, currentVideo, onQualityChange, onPlaybackRateChange }) => {
  const qualityOptions = ['auto', '1080p', '720p', '480p', '360p'];
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Mevcut video için kullanılabilir kaliteleri belirle
  const availableQualities = qualityOptions.filter(q => {
    if (q === 'auto') return true;
    return currentVideo.qualities && currentVideo.qualities[q];
  });

  if (!isOpen) return null;

  return (
    <div 
      data-settings-menu
      className="absolute bottom-16 right-0 bg-black bg-opacity-95 backdrop-blur rounded-lg p-4 min-w-48 border border-gray-600"
    >
      <div className="space-y-4">
        {/* Playback Speed */}
        <div>
          <div className="text-white text-sm mb-2 font-semibold">Oynatma Hızı</div>
          <div className="grid grid-cols-3 gap-1">
            {playbackRates.map((rate) => (
              <button
                key={rate}
                onClick={() => onPlaybackRateChange(rate)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  playbackRate === rate
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <div className="text-white text-sm mb-2 font-semibold">Kalite</div>
          <div className="space-y-1">
            {availableQualities.map((q) => (
              <button
                key={q}
                onClick={() => onQualityChange(q)}
                className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                  quality === q
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  sources = [],
  initialSource,
  autoPlay = false,
  loop = false,
  muted = false,
  volume: initialVolume = 0.8,
  className = '',
  onVideoChange,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onFullscreenChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  // Default video sources if none provided
  const defaultSources: VideoSource[] = [
    {
      id: 1,
      name: "Big Buck Bunny",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
      duration: "10:34",
      description: "Big Buck Bunny kısa film animasyonu",
      category: "Animasyon",
      views: "1.2M",
      likes: "45K",
      qualities: {
        '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        '480p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    }
  ];

  const videoSources = sources.length > 0 ? sources : defaultSources;

  // Custom hooks
  const videoPlayer = useVideoPlayer(videoSources, initialSource);
  const controls = useVideoControls(videoRef, videoPlayer.currentVideo);

  // Initialize volume and muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = initialVolume;
      videoRef.current.muted = muted;
    }
  }, [initialVolume, muted]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      controls.setShowControls(true);
      clearTimeout(timeout);
      
      if (videoPlayer.isPlaying) {
        timeout = setTimeout(() => {
          controls.setShowControls(false);
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => {
        if (videoPlayer.isPlaying) {
          timeout = setTimeout(() => controls.setShowControls(false), 1000);
        }
      });
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [videoPlayer.isPlaying, controls.setShowControls]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      videoPlayer.setDuration(video.duration);
      videoPlayer.setIsBuffering(false);
      
      // Video metadata yüklendiğinde thumbnail oluştur (eğer poster yoksa)
      if (!videoPlayer.currentVideo.poster) {
        controls.generateThumbnail();
      }
    };

    const handleTimeUpdate = () => {
      videoPlayer.setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    const handleWaiting = () => videoPlayer.setIsBuffering(true);
    const handleCanPlay = () => {
      videoPlayer.setIsBuffering(false);
      
      // Video oynatılmaya hazır olduğunda thumbnail oluştur (eğer poster yoksa)
      if (!videoPlayer.currentVideo.poster && !controls.thumbnailUrl) {
        controls.generateThumbnail();
      }
    };
    
    const handlePlay = () => {
      videoPlayer.setIsPlaying(true);
      onPlay?.();
    };
    
    const handlePause = () => {
      videoPlayer.setIsPlaying(false);
      onPause?.();
    };
    
    const handleEnded = () => {
      videoPlayer.setIsPlaying(false);
      onEnded?.();
      if (loop) {
        video.currentTime = 0;
        video.play();
        videoPlayer.setIsPlaying(true);
      } else if (videoPlayer.currentVideoIndex < videoSources.length - 1) {
        videoPlayer.playNext();
      }
    };

    const handleError = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      const error = target.error;
      let errorMessage = 'Video yüklenirken hata oluştu';
      
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Video yükleme iptal edildi';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Ağ hatası - video yüklenemedi';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Video formatı desteklenmiyor';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Video kaynağı desteklenmiyor';
            break;
          default:
            errorMessage = 'Bilinmeyen video hatası';
        }
      }
      
      controls.setVideoError(errorMessage);
      videoPlayer.setIsBuffering(false);
      console.error('Video error:', errorMessage, error);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [loop, videoPlayer.currentVideoIndex, onPlay, onPause, onEnded, onTimeUpdate]);

  // Volume control
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = videoPlayer.isMuted ? 0 : videoPlayer.volume;
    }
  }, [videoPlayer.volume, videoPlayer.isMuted]);

  // Callbacks
  const handleVolumeChange = useCallback((newVolume: number) => {
    videoPlayer.setVolume(newVolume);
    videoPlayer.setIsMuted(newVolume === 0);
    onVolumeChange?.(newVolume);
  }, [videoPlayer, onVolumeChange]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    if (!progressBar || !videoRef.current) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * videoPlayer.duration;
    
    videoRef.current.currentTime = newTime;
    videoPlayer.setCurrentTime(newTime);
  }, [videoPlayer.duration]);

  // Calculations
  const progressPercentage = videoPlayer.duration > 0 ? (videoPlayer.currentTime / videoPlayer.duration) * 100 : 0;

  return (
    <div className={className}>
      <div 
        ref={containerRef}
        className="relative bg-black rounded-lg overflow-hidden shadow-lg group"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={controls.currentVideoUrl}
          poster={controls.thumbnailUrl || videoPlayer.currentVideo.poster}
          onClick={controls.togglePlay}
          loop={loop}
          autoPlay={autoPlay}
          crossOrigin="anonymous"
          preload="metadata"
          playsInline
        />

        {/* Buffering/Loading */}
        {(videoPlayer.isBuffering || videoPlayer.duration === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
              <div className="text-white text-sm">Yükleniyor...</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {controls.videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="flex flex-col items-center space-y-4 text-center p-6">
              <div className="text-red-400 text-4xl">⚠️</div>
              <div className="text-white text-lg font-semibold">Video Hatası</div>
              <div className="text-gray-300 text-sm max-w-md">{controls.videoError}</div>
              <button
                onClick={() => {
                  controls.setVideoError(null);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        )}

        {/* Center Play Button */}
        {!videoPlayer.isPlaying && !videoPlayer.isBuffering && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={controls.togglePlay}
          >
            <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-80 transition-all">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Skip Buttons */}
        {/* <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={() => controls.skip(-10)}
            className="pointer-events-auto bg-black bg-opacity-60 backdrop-blur-sm rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-opacity-80"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => controls.skip(10)}
            className="pointer-events-auto bg-black bg-opacity-60 backdrop-blur-sm rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-opacity-80"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div> */}

        {/* Settings Menu */}
        <SettingsMenu
          isOpen={controls.showSettings}
          quality={controls.quality}
          playbackRate={controls.playbackRate}
          currentVideo={videoPlayer.currentVideo}
          onQualityChange={controls.changeQuality}
          onPlaybackRateChange={controls.changePlaybackRate}
        />

        {/* Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-all duration-300 ${
            controls.showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-3">
            <div 
              className="w-full h-1.5 bg-white bg-opacity-30 rounded-full cursor-pointer relative group/progress"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
                style={{ left: `${progressPercentage}%`, marginLeft: '-6px' }}
              />
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Previous */}
              {/* <button
                onClick={videoPlayer.playPrevious}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button> */}

              {/* Play/Pause */}
              <button
                onClick={controls.togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {videoPlayer.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              {/* Next */}
              {/* <button
                onClick={videoPlayer.playNext}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button> */}

              {/* Volume */}
              <div className="flex items-center space-x-2 group/volume">
                <button
                  onClick={() => videoPlayer.setIsMuted(!videoPlayer.isMuted)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {videoPlayer.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="w-0 group-hover/volume:w-16 overflow-hidden transition-all duration-200">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={videoPlayer.isMuted ? 0 : videoPlayer.volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="text-white text-sm font-mono">
                {formatTime(videoPlayer.currentTime)} / {formatTime(videoPlayer.duration)}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Settings */}
              <div className="relative">
                <button
                  data-settings-button
                  onClick={() => controls.setShowSettings(!controls.showSettings)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Fullscreen */}
              <button
                onClick={controls.toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {controls.isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;