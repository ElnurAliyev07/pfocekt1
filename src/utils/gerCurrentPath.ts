import { headers } from 'next/headers';

export async function getCurrentPath(): Promise<string> {
  const headersList = await headers(); // Promise çözümü için await kullanıyoruz
  const referer = headersList.get('referer'); // Önceki sayfanın URL'si
  // Referer varsa parse edilerek yol alınır, yoksa varsayılan olarak "/" döner
  return referer ? new URL(referer).pathname : '/';
}

