// src/utils/mimeTypeIcons.ts

import {
    FaFilePdf,
    FaFileImage,
    FaFileVideo,
    FaFileAudio,
    FaFileAlt
  } from 'react-icons/fa';
  
  // MIME türlerini gruplar halinde tanımlayalım
  const DOCUMENT_TYPES: string[] = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.oasis.opendocument.presentation'
  ];
  
  const VIDEO_TYPES: string[] = [
    'video/mp4',
    'video/mpeg',
    'video/x-msvideo',
    'video/webm',
    'video/quicktime',
    'video/x-flv',
    'video/x-ms-wmv',
    'video/x-matroska',
    'video/ogg',
    'video/3gpp',
    'video/3gpp2'
  ];
  
  const IMAGE_TYPES: string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/x-icon',
    'image/heif',
    'image/heic'
  ];
  
  const AUDIO_TYPES: string[] = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/x-aac',
    'audio/mp4',
    'audio/webm',
    'audio/x-ms-wma',
    'audio/flac',
    'audio/x-wav',
    'audio/amr'
  ];
  
  // MIME türüne göre ikon döndüren fonksiyon
  export const getFileIcon = (mimeType: string): React.ReactElement => {
    if (DOCUMENT_TYPES.includes(mimeType)) {
      return <FaFilePdf size={32} />;
    }
    if (VIDEO_TYPES.includes(mimeType)) {
      return <FaFileVideo size={32} />;
    }
    if (IMAGE_TYPES.includes(mimeType)) {
      return <FaFileImage size={32} />;
    }
    if (AUDIO_TYPES.includes(mimeType)) {
      return <FaFileAudio size={32} />;
    }
  
    // Varsayılan ikon
    return <FaFileAlt size={32} />;
  };
  