export interface PortfolioMedia {
  id: number;
  image: string;
  is_main: boolean;
  uploaded_at: string;
}


import { z } from 'zod';

export const portfolioFormSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  link: z.string().url('Etibarlı bir URL daxil edin').optional().or(z.literal('')),
  mediaEnabled: z.boolean(),
  medias: z.array(z.object({
    image: z.union([z.instanceof(File), z.string()]).optional(),
    is_main: z.boolean(),
  })).optional(),
}).refine(data => {
  const hasTitle = !!data.title && data.title.trim() !== '';
  const hasLink = !!data.link && data.link.trim() !== '';
  return hasTitle || hasLink;
}, {
  message: 'Başlıq və ya Linkdən biri tələb olunur.',
  path: ['title'],
}).refine(data => {
  return !data.mediaEnabled || (data.medias && data.medias.length > 0);
}, {
  message: 'Media əlavə et aktiv olduqda ən az bir şəkil yüklənməlidir.',
  path: ['medias'],
});

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

export interface Portfolio {
  id: number;
  user: number;
  title: string;
  description: string;
  link?: string | null;
  created_at: string;
  updated_at: string;
  medias: PortfolioMedia[];
}