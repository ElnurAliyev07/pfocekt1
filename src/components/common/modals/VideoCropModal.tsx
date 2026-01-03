// VideoCropModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/components/ui/modal/Modal';
import { ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal/ModalContent';

interface VideoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: File;
  onCrop: (croppedVideo: File) => void;
}

const VideoCropModal: React.FC<VideoCropModalProps> = ({ isOpen, onClose, video, onCrop }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setLoading(false);
        setError(null);
        setStartTime(0);
        setEndTime(0);
        setDuration(0);
      };
    }
  }, [video]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setEndTime(videoDuration);
    }
  };

  const handleApplyCrop = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate video processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just return the original video
      // In a real implementation, you would process the video here
      onCrop(video);
      onClose();
    } catch (err) {
      console.error("Video kırpma işlemi hata ile sonuçlandı:", err);
      setError("Kırpma sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl">
        <ModalHeader>
          Videonu kəsin
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="relative">
              {videoUrl && (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full max-h-96 rounded-lg bg-black"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      if (videoRef.current.currentTime < startTime || videoRef.current.currentTime > endTime) {
                        videoRef.current.currentTime = startTime;
                      }
                    }
                  }}
                />
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlanğıc vaxtı: {formatTime(startTime)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const newStartTime = parseFloat(e.target.value);
                    setStartTime(newStartTime);
                    if (newStartTime > endTime) {
                      setEndTime(newStartTime);
                    }
                    if (videoRef.current) {
                      videoRef.current.currentTime = newStartTime;
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş vaxtı: {formatTime(endTime)}
                </label>
                <input
                  type="range"
                  min={startTime}
                  max={duration}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    const newEndTime = parseFloat(e.target.value);
                    setEndTime(newEndTime);
                    if (videoRef.current) {
                      videoRef.current.currentTime = newEndTime;
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  Seçilmiş müddət: {formatTime(endTime - startTime)}
                </p>
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={loading || !video || !(endTime > startTime)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? 'Kəsilir...' : 'Tətbiq et'}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VideoCropModal;