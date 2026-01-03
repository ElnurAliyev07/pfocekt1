import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Bu arayüzü FFmpegVideoProcessor'un dışarıya açtığı fonksiyonlar için kullanıyoruz
export interface FFmpegVideoProcessorRef {
  processVideo: () => Promise<void>;
}

interface FFmpegVideoProcessorProps {
  video: File;
  startTime: number;
  endTime: number;
  onCrop: (croppedVideo: File) => void;
  onClose: () => void;
  setLoading: (isLoading: boolean) => void; // Parent'ın loading state'ini güncellemek için
  setError: (error: string | null) => void; // Parent'ın error state'ini güncellemek için
}

// `forwardRef` kullanarak bu bileşenin ref'ini dışarıya açabiliyoruz
const FFmpegVideoProcessor = forwardRef<FFmpegVideoProcessorRef, FFmpegVideoProcessorProps>(({
  video,
  startTime,
  endTime,
  onCrop,
  onClose,
  setLoading,
  setError,
}, ref) => {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState<boolean>(false);

  // FFmpeg kütüphanesini yükleme fonksiyonu
  const loadFFmpeg = async () => {
    if (ffmpegLoaded) return; // Zaten yüklüyse tekrar yükleme

    setLoading(true); // Yükleme durumunu başlat
    setError(null); // Önceki hataları temizle
    try {
      const ffmpeg = new FFmpeg();
      // FFmpeg core dosyalarının URL'leri.
      // Üretim ortamı için bunları kendi sunucunuzda (örn. `/public/ffmpeg-core`) barındırmanız önerilir.
      // Örneğin: const baseURL = '/ffmpeg-core';
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'; 
      
      ffmpeg.on('log', ({ message }) => {
        // Hata ayıklama ve bilgi amaçlı FFmpeg loglarını konsola yazdırabilirsiniz
        // console.log('[FFmpeg log]:', message);
      });
      
      // İsteğe bağlı: İşlem ilerlemesini izlemek için
      ffmpeg.on('progress', ({ progress, time }) => {
        // console.log(`Progress: ${progress * 100}% at ${time / 1000} seconds`);
        // İlerleme çubuğu gibi UI elemanlarını güncellemek için kullanılabilir
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      ffmpegRef.current = ffmpeg;
      setFFmpegLoaded(true);
    } catch (err) {
      console.error("FFmpeg yüklənərkən xəta baş verdi:", err);
      setError('Video işləmə kitabxanası yüklənə bilmədi. İnternet bağlantınızı yoxlayın.');
    } finally {
      setLoading(false); // Yükleme tamamlandı
    }
  };

  useEffect(() => {
    // Bileşen mount edildiğinde (veya açıldığında) FFmpeg'i yüklemeye çalış
    loadFFmpeg();
  }, []); // Sadece bir kez mount edildiğinde çalışır

  // Dışarıdan çağrılabilen video işleme fonksiyonu
  const handleProcessVideo = async () => {
    if (!ffmpegRef.current || !ffmpegLoaded) {
      setError('Video işləyici hələ hazır deyil.');
      return;
    }
    if (!(video instanceof File)) {
        setError('Keçərli bir video faylı təqdim edilməyib.');
        return;
    }
    if (!(endTime > startTime)) {
        setError('Kəsilmə aralığı yanlışdır.');
        return;
    }

    setLoading(true);
    setError(null);

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';

    try {
      const ffmpeg = ffmpegRef.current;

      // Videoyu belleğe yazın
      await ffmpeg.writeFile(inputFileName, new Uint8Array(await video.arrayBuffer()));

      // FFmpeg komutunu çalıştırın:
      // -ss: Başlangıç süresi
      // -i: Giriş dosyası
      // -t: Süre (endTime - startTime)
      // -c copy: Video ve ses akışlarını yeniden kodlamadan kopyala (daha hızlı)
      // Eğer daha hassas kesimler veya farklı bir kodek gerekiyorsa `-c copy` yerine `-c:v libx264 -c:a aac` gibi kodekler kullanmalısınız.
      // Ancak bu, işlem süresini artıracaktır.
      await ffmpeg.exec([
        '-ss', String(startTime),
        '-i', inputFileName,
        '-t', String(endTime - startTime),
        '-c', 'copy', 
        outputFileName,
      ]);

      // Kırpılmış videoyu bellekten okuyun
      const data = await ffmpeg.readFile(outputFileName);
      
      // Blob oluşturun ve File nesnesine dönüştürün
      const croppedBlob = new Blob([data], { type: video.type });
      const croppedFile = new File([croppedBlob], `cropped_${video.name}`, { type: video.type });

      onCrop(croppedFile); // Kırpılmış videoyu ana bileşene geri gönder
      onClose(); // İşlem bittiğinde modalı kapat
    } catch (err) {
      console.error("Video kəsilərkən xəta baş verdi:", err);
      setError(err instanceof Error ? `Video kəsilərkən xəta: ${err.message}` : 'Video kəsilərkən naməlum bir xəta baş verdi.');
    } finally {
      setLoading(false); // Yüklemeyi bitir
      // İşlem bittikten sonra FFmpeg'in kullandığı dosyaları sanal dosya sisteminden temizleyebilirsiniz (isteğe bağlı)
      try {
        await ffmpegRef.current?.deleteFile(inputFileName);
        await ffmpegRef.current?.deleteFile(outputFileName);
      } catch (cleanUpErr) {
        console.warn("FFmpeg fayllarını təmizləyərkən xəta baş verdi:", cleanUpErr);
      }
    }
  };

  // `useImperativeHandle` ile `processVideo` fonksiyonunu dışarıya açıyoruz
  useImperativeHandle(ref, () => ({
    processVideo: handleProcessVideo,
  }));

  // Bu bileşen görsel bir çıktı sağlamaz, sadece mantığı yönetir.
  return null; 
});

export default FFmpegVideoProcessor;