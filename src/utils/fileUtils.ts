import { CustomFile } from "@/types/customFile.type";

export function checkFileType(url: string): string {
    // URL'deki dosya uzantısını kontrol etmek için Regex kullanılır
    const extension = url.split('.').pop()?.toLowerCase();
  
    if (!extension) {
      return "Unknown file type";
    }
  
    switch (extension) {
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
        return "Video";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
        return "Image";
      case "mp3":
      case "wav":
      case "ogg":
      case "flac":
        return "Audio";
      default:
        return "Unknown file type";
    }
  }

  
  type CustomFileOrUrl = CustomFile | string;

/**
 * Base64 string'den File objesi oluşturur
 */
export function base64ToFile(customFile: CustomFile): File {
    try {
        const byteCharacters = atob(customFile.file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new File([byteArray], customFile.title, {
            type: customFile.mime_type,
            lastModified: new Date(customFile.updated).getTime()
        });
    } catch (error) {
        throw new Error(`Base64 decode hatası: ${error}`);
    }
}

/**
 * Data URL (data:image/png;base64,...) string'den File objesi oluşturur
 */
export function dataURLToFile(customFile: CustomFile): File {
    try {
        const dataURL = customFile.file;
        if (!dataURL.includes(',')) {
            throw new Error('Geçersiz data URL formatı');
        }

        const arr = dataURL.split(',');
        const bstr = atob(arr[1]);
        const byteArray = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
            byteArray[i] = bstr.charCodeAt(i);
        }

        return new File([byteArray], customFile.title, {
            type: customFile.mime_type,
            lastModified: new Date(customFile.updated).getTime()
        });
    } catch (error) {
        throw new Error(`Data URL decode hatası: ${error}`);
    }
}

/**
 * URL'den fetch ile File objesi oluşturur
 */

export async function urlToFile(input: CustomFileOrUrl): Promise<File> {
    let fileData: string;
    let filename = "file";
    let mimeType = "application/octet-stream";
    let updated = new Date().toISOString();

    if (typeof input === "string") {
        fileData = input;
    } else {
        fileData = input.file;
        filename = input.title;
        mimeType = input.mime_type || mimeType;
        updated = input.updated || updated;
    }

    // Əgər base64 və ya dataURL-dirsə, birbaşa File obyektinə çevir
    if (fileData.startsWith("data:")) {
        const arr = fileData.split(",");
        const mime = arr[0].match(/:(.*?);/);
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {
            type: mime ? mime[1] : mimeType,
            lastModified: new Date(updated).getTime(),
        });
    }

    // Əgər HTTP(S) URL-dirsə, fetch et
    try {
        const response = await fetch(`/api/proxy?url=${fileData}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const finalMime = blob.type || mimeType;
        return new File([blob], filename, {
            type: finalMime,
            lastModified: new Date(updated).getTime(),
        });
    } catch (error) {
        throw new Error(`URL fetch hatası: ${error}`);
    }
}


/**
 * Hem CustomFile hem de string URL/base64/dataURL destekleyen fonksiyon
 */
export function customFileToFile(input: CustomFileOrUrl): File | Promise<File> {
    let fileData: string;
    let filename = 'file';
    let mimeType = 'application/octet-stream';
    let updated = new Date().toISOString();

    if (typeof input === 'string') {
        fileData = input;
    } else {
        fileData = input.file;
        filename = input.title;
        mimeType = input.mime_type;
        updated = input.updated;
    }

    if (fileData.startsWith('data:')) {
        return dataURLToFile({
            file: fileData,
            title: filename,
            mime_type: mimeType,
            updated,
        } as CustomFile);
    }

    if (fileData.startsWith('http://') || fileData.startsWith('https://')) {
        return urlToFile({
            file: fileData,
            title: filename,
            mime_type: mimeType,
            updated,
        } as CustomFile);
    }

    return base64ToFile({
        file: fileData,
        title: filename,
        mime_type: mimeType,
        updated,
    } as CustomFile);
}

/**
 * Type guard - CustomFile tipini kontrol eder
 */
export function isValidCustomFile(obj: any): obj is CustomFile {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.title === 'string' &&
        typeof obj.file === 'string' &&
        typeof obj.mime_type === 'string' &&
        typeof obj.size === 'number' &&
        typeof obj.created === 'string' &&
        typeof obj.updated === 'string'
    );
}

/**
 * Birden fazla CustomFile veya string URL/base64 veri objesini aynı anda dönüştürür
 */
export async function convertMultipleFiles(inputs: CustomFileOrUrl[]): Promise<File[]> {
    const promises = inputs.map(async (input) => {
        const result = customFileToFile(input);
        return result instanceof Promise ? await result : result;
    });

    return Promise.all(promises);
}
