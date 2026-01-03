'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from '@/components/ui/modal/Modal';
import { ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal/ModalContent';
import Image from 'next/image';
import { Crop as CropIcon, RotateCcw, Check } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: File;
  onCrop: (croppedImage: File) => void;
  aspectRatio?: number;
  cropWidth?: number;
  cropHeight?: number;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  image,
  onCrop,
  cropWidth = 300,
  cropHeight = 300,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotate(0);
      setOffset({ x: 0, y: 0 });
      setError(null);
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging || !dragStart || !imageRef) return;
    const clientX = 'touches' in e && 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e && 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    let newX = clientX - dragStart.x;
    let newY = clientY - dragStart.y;

    // Sınırları hesapla
    const imgWidth = cropWidth * zoom;
    const imgHeight = cropHeight * zoom;
    const minX = Math.min(0, cropWidth - imgWidth) / 2;
    const maxX = Math.max(0, (imgWidth - cropWidth) / 2);
    const minY = Math.min(0, cropHeight - imgHeight) / 2;
    const maxY = Math.max(0, (imgHeight - cropHeight) / 2);

    // Clamp offset
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    setOffset({ x: newX, y: newY });
  }, [dragging, dragStart, zoom, cropWidth, cropHeight, imageRef]);

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove]);

  const handleCropComplete = async () => {
    if (!imageRef) return;
    setLoading(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context could not be created.');

      ctx.save();
      ctx.translate(cropWidth / 2, cropHeight / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const scale = imageRef.naturalWidth / cropWidth;

      const dx = offset.x / zoom;
      const dy = offset.y / zoom;

      ctx.drawImage(
        imageRef,
        (imageRef.naturalWidth - cropWidth * scale) / 2 - dx * scale,
        (imageRef.naturalHeight - cropHeight * scale) / 2 - dy * scale,
        cropWidth * scale,
        cropHeight * scale,
        -cropWidth / 2,
        -cropHeight / 2,
        cropWidth,
        cropHeight
      );

      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], image.name, {
            type: image.type,
            lastModified: Date.now(),
          });
          onCrop(croppedFile);
          onClose();
        } else {
          setError('Şəkil kəsilmədi.');
        }
        setLoading(false);
      }, image.type);
    } catch (err: any) {
      setError(err.message || 'Xəta baş verdi');
      setLoading(false);
    }
  };

  // Calculate modal size based on crop dimensions
  const getModalSize = () => {
    const maxWidth = 1200; // Max width for the modal
    const maxHeight = 800; // Max height for the modal
    const padding = 64; // Horizontal padding (32px each side)
    const headerHeight = 60; // Approximate height of the header
    const footerHeight = 80; // Approximate height of the footer
    const controlsHeight = 80; // Height of zoom/rotate controls
    
    // Calculate the required width and height including padding and controls
    const requiredWidth = Math.min(cropWidth + padding * 2, maxWidth);
    const requiredHeight = Math.min(
      cropHeight + headerHeight + footerHeight + controlsHeight + 40, // 40px for additional spacing
      maxHeight
    );
    
    // Return the appropriate size class based on the required dimensions
    if (requiredWidth >= 1024 || requiredHeight >= 800) return '5xl';
    if (requiredWidth >= 768 || requiredHeight >= 600) return '4xl';
    if (requiredWidth >= 640 || requiredHeight >= 500) return 'xl';
    if (requiredWidth >= 500) return 'lg';
    if (requiredWidth >= 400) return 'md';
    return 'sm';
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size={getModalSize()}>
      <ModalContent className="max-w-[95vw]">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <CropIcon className="w-5 h-5" />
            <span className="text-lg font-semibold">Şəkili Redaktə Et</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center gap-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div
              ref={containerRef}
              style={{
                width: cropWidth,
                height: cropHeight,
                overflow: 'hidden',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                position: 'relative',
                backgroundColor: '#fff',
                cursor: dragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                style={{
                  objectFit: 'cover',
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotate}deg)`,
                  transition: dragging ? 'none' : 'transform 0.1s ease-out',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                ref={setImageRef}
                onLoad={() => setImageLoaded(true)}
                unoptimized
                draggable={false}
                priority
              />
            </div>
            {/* Controls */}
            <div className="w-full grid grid-cols-2 gap-4">
              {/* Zoom */}
              <div>
                <label className="text-sm font-medium">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              {/* Rotate */}
              <div>
                <label className="text-sm font-medium">Rotate</label>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={rotate}
                  onChange={(e) => setRotate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setZoom(1);
                setRotate(0);
                setOffset({ x: 0, y: 0 });
              }}
              className="mt-2 px-4 py-2 text-sm border rounded-md"
            >
              <RotateCcw className="w-4 h-4 inline mr-1" />
              Parametrləri sıfırla
            </button>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-2 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-md text-sm bg-white"
            >
              Ləğv et
            </button>
            <button
              onClick={handleCropComplete}
              disabled={loading || !imageLoaded}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              {loading ? 'Emal olunur...' : (
                <>
                  <Check className="w-4 h-4 inline mr-1" />
                  Tətbiq et
                </>
              )}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImageCropModal;
