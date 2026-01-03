import React, { useEffect, useState } from 'react';
import MediaPreviewModal from '@/components/common/modals/MediaPreviewModal';
import { UploadCloud, Eye, Download, X, File, Image, Video, FileText } from 'lucide-react';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  selectedFile: File | string | null;
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, selectedFile, id }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'pdf' | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (typeof selectedFile === 'string') {
      setFileName('Media');
      setDownloadUrl(selectedFile);
      setPreviewUrl(selectedFile);
      if (selectedFile.match(/\.(jpeg|jpg|gif|png)$/)) setMediaType('image');
      else if (selectedFile.match(/\.(mp4|webm)$/)) setMediaType('video');
      else if (selectedFile.endsWith('.pdf')) setMediaType('pdf');
    } else if (selectedFile) {
      setFileName(selectedFile.name);
      const fileUrl = URL.createObjectURL(selectedFile);
      setDownloadUrl(fileUrl);
      setPreviewUrl(fileUrl);
      if (selectedFile.type.startsWith('image/')) setMediaType('image');
      else if (selectedFile.type.startsWith('video/')) setMediaType('video');
      else if (selectedFile.type === 'application/pdf') setMediaType('pdf');
    } else {
      setFileName(null);
      setDownloadUrl(null);
      setPreviewUrl('');
      setMediaType(null);
    }
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setPreviewUrl('');
    }
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      onChange(file);
    }
  };

  const getFileIcon = () => {
    switch (mediaType) {
      case 'image': return <Image className="w-4 h-4 text-blue-500" />;
      case 'video': return <Video className="w-4 h-4 text-purple-500" />;
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      default: return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleRemoveFile = (): void => {
    onChange(null);
    setPreviewUrl('');
  };

  if (selectedFile && fileName) {
    return (
      <>
        <div className="w-full group">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="p-2.5">
              <div className="flex items-center gap-2.5">
                {/* File Icon */}
                <div className="flex-shrink-0 p-1.5 rounded-lg bg-white shadow-sm">
                  {getFileIcon()}
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {fileName}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {mediaType || 'fayl'} • Yükləndi
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {mediaType !== 'pdf' && (
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow group-hover:scale-105"
                      title="Baxış"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={async () => {
                      if (!downloadUrl) return;
                      try {
                        if (downloadUrl.startsWith('data:')) {
                          const a = document.createElement('a');
                          a.href = downloadUrl;
                          a.download = fileName || 'file';
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        } else {
                          const res = await fetch(downloadUrl);
                          const blob = await res.blob();
                          const href = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = href;
                          a.download = fileName || 'file';
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          URL.revokeObjectURL(href);
                        }
                      } catch (err) {
                        console.error('Download failed', err);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-green-600 transition-all duration-200 shadow-sm hover:shadow group-hover:scale-105"
                    title="Yüklə"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow group-hover:scale-105"
                    title="Sil"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Preview Modal */}
        {mediaType && mediaType !== 'pdf' && previewUrl && (
          <MediaPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            mediaUrl={previewUrl}
            mediaType={mediaType}
            alt={fileName || 'Preview'}
          />
        )}
      </>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`relative group transition-all duration-300 ${
          isDragOver 
            ? 'scale-[1.02] shadow-lg' 
            : 'hover:scale-[1.01] hover:shadow-md'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label
          htmlFor={id}
          className={`
            flex items-center justify-center w-full h-16 cursor-pointer
            rounded-xl border-2 border-dashed transition-all duration-300
            ${isDragOver 
              ? 'border-blue-400 bg-blue-50/80 backdrop-blur-sm' 
              : 'border-slate-300 bg-gradient-to-br from-slate-50 to-white hover:border-blue-300 hover:bg-blue-50/30'
            }
            shadow-sm hover:shadow-md
          `}
        >
          <div className="flex items-center justify-center gap-2.5 px-4">
            <div className={`
              p-1.5 rounded-full transition-all duration-300
              ${isDragOver 
                ? 'bg-blue-100 text-blue-600 scale-110' 
                : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-105'
              }
            `}>
              <UploadCloud className="w-4 h-4" />
            </div>
            
            <div className="text-center">
              <p className={`
                text-sm font-medium transition-colors duration-300
                ${isDragOver 
                  ? 'text-blue-700' 
                  : 'text-slate-700 group-hover:text-blue-700'
                }
              `}>
                <span className="font-semibold">Kliklə</span> və ya fayl at
              </p>
              
              <p className={`
                text-xs transition-colors duration-300
                ${isDragOver 
                  ? 'text-blue-500' 
                  : 'text-slate-500 group-hover:text-blue-500'
                }
              `}>
                PNG, JPG, PDF və ya MP4
              </p>
            </div>
          </div>
          
          {/* Animated background gradient */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-blue-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-blue-400/5 transition-all duration-500"></div>
        </label>
        
        <input 
          type="file" 
          id={id} 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*,video/*,.pdf"
        />
      </div>
    </div>
  );
};

export default FileUpload;