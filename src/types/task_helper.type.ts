// Ana kategori türleri
export type TaskCategoryKey = 
  | 'social_media'
  | 'content' 
  | 'design'
  | 'development'
  | 'marketing'
  | 'other';

// Alt kategori türleri (ana kategorilere göre gruplandırılmış)
export type TaskSubcategoryKey = 
  // Sosial Media Alt Kategoriyaları
  | 'social_media_post'
  | 'social_media_campaign'
  | 'social_media_analysis'
  // Məzmun Alt Kategoriyaları  
  | 'content_article'
  | 'content_blog'
  | 'content_news'
  | 'content_script'
  // Dizayn Alt Kategoriyaları
  | 'design_graphic'
  | 'design_ui'
  | 'design_ux'
  | 'design_illustration'
  // İnkişaf Alt Kategoriyaları
  | 'development_frontend'
  | 'development_backend'
  | 'development_mobile'
  | 'development_testing'
  // Marketinq Alt Kategoriyaları
  | 'marketing_seo'
  | 'marketing_email'
  | 'marketing_ppc'
  | 'marketing_analytics'
  // Digər
  | 'other_general';

// Alt görev türleri (çok uzun olduğu için örnekleme)
export type SubtaskKey = 
  // General Social Media Post Tasks
  | 'social_media_post_writing'
  | 'social_media_post_editing'
  | 'social_media_post_proofreading'
  | 'social_media_post_translation'
  | 'social_media_post_localization'
  | 'social_media_post_seo'
  | 'social_media_post_hashtag'
  | 'social_media_post_topic'
  | 'social_media_post_competitor'
  | 'social_media_post_trending'
  | 'social_media_post_audience'
  | 'social_media_post_persona'
  | 'social_media_post_calendar'
  | 'social_media_post_strategy'
  | 'social_media_post_optimization'
  | 'social_media_post_repurposing'
  | 'social_media_post_curation'
  | 'social_media_post_syndication'
  
  // General Social Media Media Tasks
  | 'social_media_image_creation'
  | 'social_media_image_editing'
  | 'social_media_image_optimization'
  | 'social_media_image_resizing'
  | 'social_media_image_formatting'
  | 'social_media_image_compression'
  | 'social_media_image_watermark'
  | 'social_media_image_caption'
  | 'social_media_image_alt_text'
  | 'social_media_image_metadata'
  
  | 'social_media_video_creation'
  | 'social_media_video_editing'
  | 'social_media_video_optimization'
  | 'social_media_video_compression'
  | 'social_media_video_formatting'
  | 'social_media_video_thumbnail'
  | 'social_media_video_caption'
  | 'social_media_video_metadata'
  
  | 'social_media_audio_creation'
  | 'social_media_audio_editing'
  | 'social_media_audio_optimization'
  | 'social_media_audio_compression'
  | 'social_media_audio_formatting'
  | 'social_media_audio_metadata'
  
  | 'social_media_gif_creation'
  | 'social_media_gif_editing'
  | 'social_media_gif_optimization'
  | 'social_media_gif_compression'
  | 'social_media_gif_formatting'
  
  | 'social_media_carousel_creation'
  | 'social_media_carousel_editing'
  | 'social_media_carousel_optimization'
  | 'social_media_carousel_formatting'
  
  // Instagram Specific Tasks
  | 'instagram_post_caption'
  | 'instagram_post_hashtag'
  | 'instagram_post_media'
  | 'instagram_story_content'
  | 'instagram_story_media'
  | 'instagram_reel_script'
  | 'instagram_reel_editing'
  | 'instagram_carousel_content'
  | 'instagram_carousel_media'
  | 'instagram_igtv_script'
  | 'instagram_igtv_editing'
  | 'instagram_live_preparation'
  | 'instagram_ads_creation'
  | 'instagram_shopping_setup'
  | 'instagram_guides_creation'
  | 'instagram_highlights_curation'
  | 'instagram_analytics_review'
  | 'instagram_engagement_management'
  | 'instagram_influencer_management'
  | 'instagram_content_review'
  | 'instagram_publishing'
  | 'instagram_scheduling'
  
  // Facebook Specific Tasks
  | 'facebook_post_content'
  | 'facebook_post_media'
  | 'facebook_story_content'
  | 'facebook_story_media'
  | 'facebook_video_script'
  | 'facebook_video_editing'
  | 'facebook_live_preparation'
  | 'facebook_event_creation'
  | 'facebook_page_management'
  | 'facebook_group_management'
  | 'facebook_ads_creation'
  | 'facebook_marketplace_setup'
  | 'facebook_messenger_setup'
  | 'facebook_analytics_review'
  | 'facebook_community_management'
  | 'facebook_content_review'
  | 'facebook_publishing'
  | 'facebook_scheduling'
  
  // TikTok Specific Tasks
  | 'tiktok_script_writing'
  | 'tiktok_video_editing'
  | 'tiktok_music_selection'
  | 'tiktok_effects_selection'
  | 'tiktok_duet_creation'
  | 'tiktok_stitch_creation'
  | 'tiktok_live_preparation'
  | 'tiktok_hashtag_research'
  | 'tiktok_trend_analysis'
  | 'tiktok_challenge_creation'
  | 'tiktok_ads_creation'
  | 'tiktok_spark_ads_setup'
  | 'tiktok_analytics_review'
  | 'tiktok_influencer_management'
  | 'tiktok_content_review'
  | 'tiktok_publishing'
  | 'tiktok_scheduling'
  
  // YouTube Specific Tasks
  | 'youtube_script_writing'
  | 'youtube_video_editing'
  | 'youtube_thumbnail_creation'
  | 'youtube_description_writing'
  | 'youtube_tags_research'
  | 'youtube_short_creation'
  | 'youtube_live_preparation'
  | 'youtube_premiere_setup'
  | 'youtube_playlist_creation'
  | 'youtube_community_management'
  | 'youtube_channel_management'
  | 'youtube_seo_optimization'
  | 'youtube_ads_creation'
  | 'youtube_monetization_setup'
  | 'youtube_analytics_review'
  | 'youtube_collaboration_management'
  | 'youtube_content_review'
  | 'youtube_publishing'
  | 'youtube_scheduling'
  | 'youtube_seo'
  // Content Alt Görevleri
  | 'content_research'
  | 'content_writing'
  | 'content_editing'
  | 'content_proofreading'
  | 'content_seo'
  | 'content_keyword'
  // Design Alt Görevleri
  | 'design_concept'
  | 'design_sketch'
  | 'design_mockup'
  | 'design_prototype'
  | 'design_banner'
  | 'design_poster'
  | 'design_ui'
  | 'design_ux'
  | 'design_wireframe'
  | 'design_illustration'
  | 'design_icon'
  | 'design_infographic'
  // Video/Audio Alt Görevleri
  | 'video_concept'
  | 'video_script'
  | 'video_storyboard'
  | 'video_filming'
  // Development Alt Görevleri
  | 'dev_planning'
  | 'dev_analysis'
  | 'dev_design'
  | 'dev_architecture'
  | 'dev_frontend'
  | 'dev_web'
  | 'dev_ui'
  | 'dev_backend'
  | 'dev_api'
  | 'dev_database'
  | 'dev_mobile'
  | 'dev_testing'
  | 'dev_qa'
  | 'dev_debugging'
  // Marketing Alt Görevleri
  | 'marketing_strategy'
  | 'marketing_plan'
  | 'marketing_research'
  | 'marketing_analysis'
  | 'marketing_seo'
  | 'marketing_email'
  | 'marketing_ppc'
  | 'marketing_paid'
  | 'marketing_report'
  | 'marketing_roi'
  | 'pinterest_seo';
  // ... diğer tüm subtask'lar buraya eklenebilir

// Category ve Subcategory arasındaki ilişki mapping'i
export const CATEGORY_SUBCATEGORY_MAP: Record<TaskCategoryKey, TaskSubcategoryKey[]> = {
  social_media: [
    'social_media_post',
    'social_media_campaign', 
    'social_media_analysis'
  ],
  content: [
    'content_article',
    'content_blog',
    'content_news',
    'content_script'
  ],
  design: [
    'design_graphic',
    'design_ui',
    'design_ux',
    'design_illustration'
  ],
  development: [
    'development_frontend',
    'development_backend',
    'development_mobile',
    'development_testing'
  ],
  marketing: [
    'marketing_seo',
    'marketing_email',
    'marketing_ppc',
    'marketing_analytics'
  ],
  other: [
    'other_general'
  ]
};

// Subcategory ve Subtask arasındaki ilişki mapping'i
export const SUBCATEGORY_SUBTASK_MAP: Record<TaskSubcategoryKey, SubtaskKey[]> = {
  // Social Media Alt Kategorileri
  social_media_post: [
    // General Social Media Post Tasks
    'social_media_post_writing',
    'social_media_post_editing',
    'social_media_post_proofreading',
    'social_media_post_translation',
    'social_media_post_localization',
    'social_media_post_seo',
    'social_media_post_hashtag',
    'social_media_post_topic',
    'social_media_post_competitor',
    'social_media_post_trending',
    'social_media_post_audience',
    'social_media_post_persona',
    'social_media_post_calendar',
    'social_media_post_strategy',
    'social_media_post_optimization',
    'social_media_post_repurposing',
    'social_media_post_curation',
    'social_media_post_syndication',
    
    // General Social Media Media Tasks
    'social_media_image_creation',
    'social_media_image_editing',
    'social_media_image_optimization',
    'social_media_image_resizing',
    'social_media_image_formatting',
    'social_media_image_compression',
    'social_media_image_watermark',
    'social_media_image_caption',
    'social_media_image_alt_text',
    'social_media_image_metadata',
    
    'social_media_video_creation',
    'social_media_video_editing',
    'social_media_video_optimization',
    'social_media_video_compression',
    'social_media_video_formatting',
    'social_media_video_thumbnail',
    'social_media_video_caption',
    'social_media_video_metadata',
    
    'social_media_audio_creation',
    'social_media_audio_editing',
    'social_media_audio_optimization',
    'social_media_audio_compression',
    'social_media_audio_formatting',
    'social_media_audio_metadata',
    
    'social_media_gif_creation',
    'social_media_gif_editing',
    'social_media_gif_optimization',
    'social_media_gif_compression',
    'social_media_gif_formatting',
    
    'social_media_carousel_creation',
    'social_media_carousel_editing',
    'social_media_carousel_optimization',
    'social_media_carousel_formatting',
    
    // Instagram Specific Tasks
    'instagram_post_caption',
    'instagram_post_hashtag',
    'instagram_post_media',
    'instagram_story_content',
    'instagram_story_media',
    'instagram_reel_script',
    'instagram_reel_editing',
    'instagram_carousel_content',
    'instagram_carousel_media',
    'instagram_igtv_script',
    'instagram_igtv_editing',
    'instagram_live_preparation',
    'instagram_ads_creation',
    'instagram_shopping_setup',
    'instagram_guides_creation',
    'instagram_highlights_curation',
    'instagram_analytics_review',
    'instagram_engagement_management',
    'instagram_influencer_management',
    'instagram_content_review',
    'instagram_publishing',
    'instagram_scheduling'
  ],
  social_media_campaign: [
    'instagram_ads_creation',
    'facebook_ads_creation',
    'tiktok_ads_creation',
    'youtube_ads_creation'
  ],
  social_media_analysis: [
    'instagram_analytics_review',
    'facebook_analytics_review',
    'tiktok_analytics_review',
    'youtube_analytics_review'
  ],
  
  // Content Alt Kategorileri
  content_article: [
    'content_research',
    'content_writing',
    'content_editing',
    'content_proofreading',
    'content_seo'
  ],
  content_blog: [
    'content_research',
    'content_writing',
    'content_editing',
    'content_proofreading',
    'content_seo',
    'content_keyword'
  ],
  content_news: [
    'content_research',
    'content_writing',
    'content_editing',
    'content_proofreading'
  ],
  content_script: [
    'video_script',
    'youtube_script_writing',
    'tiktok_script_writing'
  ],
  
  // Design Alt Kategorileri
  design_graphic: [
    'design_concept',
    'design_sketch',
    'design_mockup',
    'design_banner',
    'design_poster'
  ],
  design_ui: [
    'design_concept',
    'design_sketch',
    'design_mockup',
    'design_ui',
    'design_wireframe',
    'design_prototype'
  ],
  design_ux: [
    'design_concept',
    'design_sketch',
    'design_mockup',
    'design_ux',
    'design_wireframe',
    'design_prototype'
  ],
  design_illustration: [
    'design_concept',
    'design_sketch',
    'design_illustration',
    'design_icon',
    'design_infographic'
  ],
  
  // Development Alt Kategorileri
  development_frontend: [
    'dev_planning',
    'dev_analysis',
    'dev_design',
    'dev_frontend',
    'dev_web',
    'dev_ui'
  ],
  development_backend: [
    'dev_planning',
    'dev_analysis',
    'dev_design',
    'dev_backend',
    'dev_api',
    'dev_database'
  ],
  development_mobile: [
    'dev_planning',
    'dev_analysis',
    'dev_design',
    'dev_mobile'
  ],
  development_testing: [
    'dev_planning',
    'dev_analysis',
    'dev_testing',
    'dev_qa',
    'dev_debugging'
  ],
  
  // Marketing Alt Kategorileri
  marketing_seo: [
    'marketing_research',
    'marketing_analysis',
    'marketing_seo',
    'content_seo',
    'youtube_seo',
    'pinterest_seo'
  ],
  marketing_email: [
    'marketing_research',
    'marketing_analysis',
    'marketing_email'
  ],
  marketing_ppc: [
    'marketing_research',
    'marketing_analysis',
    'marketing_ppc',
    'marketing_paid'
  ],
  marketing_analytics: [
    'marketing_research',
    'marketing_analysis',
    'marketing_report',
    'marketing_roi'
  ],
  
  // Other
  other_general: []
};

// Interface tanımları
export interface TaskCategory {
  key: TaskCategoryKey;
  label: string;
}

export interface TaskSubcategory {
  key: TaskSubcategoryKey;
  label: string;
  categoryKey: TaskCategoryKey;
}

export interface Subtask {
  key: SubtaskKey;
  label: string;
  subcategoryKey: TaskSubcategoryKey;
  categoryKey: TaskCategoryKey;
}

// Ana kategoriler
export const TASK_CATEGORIES: TaskCategory[] = [
  { key: 'social_media', label: 'Sosial Media' },
  { key: 'content', label: 'Məzmun' },
  { key: 'design', label: 'Dizayn' },
  { key: 'development', label: 'İnkişaf' },
  { key: 'marketing', label: 'Marketinq' },
  { key: 'other', label: 'Digər' }
];

// Alt kategoriler
export const TASK_SUBCATEGORIES: TaskSubcategory[] = [
  // Sosial Media Alt Kategoriyaları
  { key: 'social_media_post', label: 'Sosial Media Paylaşımı', categoryKey: 'social_media' },
  { key: 'social_media_campaign', label: 'Sosial Media Kampaniyası', categoryKey: 'social_media' },
  { key: 'social_media_analysis', label: 'Sosial Media Analizi', categoryKey: 'social_media' },
  
  // Məzmun Alt Kategoriyaları
  { key: 'content_article', label: 'Məqalə', categoryKey: 'content' },
  { key: 'content_blog', label: 'Blog Yazısı', categoryKey: 'content' },
  { key: 'content_news', label: 'Xəbər', categoryKey: 'content' },
  { key: 'content_script', label: 'Ssenari', categoryKey: 'content' },
  
  // Dizayn Alt Kategoriyaları
  { key: 'design_graphic', label: 'Qrafik Dizayn', categoryKey: 'design' },
  { key: 'design_ui', label: 'UI Dizayn', categoryKey: 'design' },
  { key: 'design_ux', label: 'UX Dizayn', categoryKey: 'design' },
  { key: 'design_illustration', label: 'İllüstrasiya', categoryKey: 'design' },
  
  // İnkişaf Alt Kategoriyaları
  { key: 'development_frontend', label: 'Frontend İnkişafı', categoryKey: 'development' },
  { key: 'development_backend', label: 'Backend İnkişafı', categoryKey: 'development' },
  { key: 'development_mobile', label: 'Mobil İnkişaf', categoryKey: 'development' },
  { key: 'development_testing', label: 'Test', categoryKey: 'development' },
  
  // Marketinq Alt Kategoriyaları
  { key: 'marketing_seo', label: 'SEO', categoryKey: 'marketing' },
  { key: 'marketing_email', label: 'E-poçt Marketinqi', categoryKey: 'marketing' },
  { key: 'marketing_ppc', label: 'PPC', categoryKey: 'marketing' },
  { key: 'marketing_analytics', label: 'Marketinq Analizi', categoryKey: 'marketing' },
  
  // Digər
  { key: 'other_general', label: 'Ümumi', categoryKey: 'other' }
];

// Alt görevler
export const TASK_SUBTASKS: Subtask[] = [
  // General Social Media Post Tasks
  { key: 'social_media_post_writing', label: 'Sosial Media Post Yazma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_editing', label: 'Sosial Media Post Redaktə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_proofreading', label: 'Sosial Media Post Düzəliş', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_translation', label: 'Sosial Media Post Tərcümə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_localization', label: 'Sosial Media Post Lokallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_seo', label: 'Sosial Media Post SEO Optimallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_hashtag', label: 'Sosial Media Post Hashtag Araşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_topic', label: 'Sosial Media Post Mövzu Araşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_competitor', label: 'Sosial Media Post Rəqib Analizi', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_trending', label: 'Sosial Media Post Trend Araşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_audience', label: 'Sosial Media Post Auditoriya Araşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_persona', label: 'Sosial Media Post Müştəri Persona', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_calendar', label: 'Sosial Media Post Kalendarı', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_strategy', label: 'Sosial Media Post Strategiyası', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_optimization', label: 'Sosial Media Post Optimallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_repurposing', label: 'Sosial Media Post Yenidən İstifadə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_curation', label: 'Sosial Media Post Kuratorluğu', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_post_syndication', label: 'Sosial Media Post Sindikasiyası', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  // General Social Media Media Tasks
  { key: 'social_media_image_creation', label: 'Sosial Media Şəkil Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_editing', label: 'Sosial Media Şəkil Redaktə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_optimization', label: 'Sosial Media Şəkil Optimallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_resizing', label: 'Sosial Media Şəkil Ölçüləndirmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_formatting', label: 'Sosial Media Şəkil Formatlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_compression', label: 'Sosial Media Şəkil Sıxılması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_watermark', label: 'Sosial Media Şəkil Watermark', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_caption', label: 'Sosial Media Şəkil Başlıq', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_alt_text', label: 'Sosial Media Şəkil Alt Mətn', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_image_metadata', label: 'Sosial Media Şəkil Metadata', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  { key: 'social_media_video_creation', label: 'Sosial Media Video Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_video_editing', label: 'Sosial Media Video Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_video_optimization', label: 'Sosial Media Video Optimallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_video_compression', label: 'Sosial Media Video Sıxılması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_video_formatting', label: 'Sosial Media Video Formatlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_video_thumbnail', label: 'Sosial Media Video Thumbnail', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_video_caption', label: 'Sosial Media Video Altyazı', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_video_metadata', label: 'Sosial Media Video Metadata', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  { key: 'social_media_audio_creation', label: 'Sosial Media Audio Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_audio_editing', label: 'Sosial Media Audio Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_audio_optimization', label: 'Sosial Media Audio Optimallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_audio_compression', label: 'Sosial Media Audio Sıxılması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_audio_formatting', label: 'Sosial Media Audio Formatlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_audio_metadata', label: 'Sosial Media Audio Metadata', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  { key: 'social_media_gif_creation', label: 'Sosial Media GIF Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_gif_editing', label: 'Sosial Media GIF Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_gif_optimization', label: 'Sosial Media GIF Optimallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_gif_compression', label: 'Sosial Media GIF Sıxılması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_gif_formatting', label: 'Sosial Media GIF Formatlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  { key: 'social_media_carousel_creation', label: 'Sosial Media Carousel Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_carousel_editing', label: 'Sosial Media Carousel Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_carousel_optimization', label: 'Sosial Media Carousel Optimallaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'social_media_carousel_formatting', label: 'Sosial Media Carousel Formatlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  // Instagram Specific Tasks
  { key: 'instagram_post_caption', label: 'Instagram Post Başlıq Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_post_hashtag', label: 'Instagram Post Hashtag Araşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_post_media', label: 'Instagram Post Media Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_story_content', label: 'Instagram Story Məzmun Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_story_media', label: 'Instagram Story Media Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_reel_script', label: 'Instagram Reel Ssenari Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_reel_editing', label: 'Instagram Reel Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_carousel_content', label: 'Instagram Carousel Məzmun Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_carousel_media', label: 'Instagram Carousel Media Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_igtv_script', label: 'Instagram IGTV Ssenari Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_igtv_editing', label: 'Instagram IGTV Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_live_preparation', label: 'Instagram Canlı Yayın Hazırlığı', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_ads_creation', label: 'Instagram Reklam Hazırlama', subcategoryKey: 'social_media_campaign', categoryKey: 'social_media' },
  { key: 'instagram_shopping_setup', label: 'Instagram Alış-veriş Quraşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_guides_creation', label: 'Instagram Bələdçi Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_highlights_curation', label: 'Instagram Qabaqcıl Məzmun Seçimi', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_analytics_review', label: 'Instagram Analitika Yoxlaması', subcategoryKey: 'social_media_analysis', categoryKey: 'social_media' },
  { key: 'instagram_engagement_management', label: 'Instagram Qarşılıqlı Əlaqə İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_influencer_management', label: 'Instagram İnfluenser İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_content_review', label: 'Instagram Məzmun Yoxlaması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_publishing', label: 'Instagram Yayımlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'instagram_scheduling', label: 'Instagram Planlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  // Facebook Specific Tasks
  { key: 'facebook_post_content', label: 'Facebook Post Məzmun Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_post_media', label: 'Facebook Post Media Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_story_content', label: 'Facebook Story Məzmun Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_story_media', label: 'Facebook Story Media Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_video_script', label: 'Facebook Video Ssenari Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_video_editing', label: 'Facebook Video Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_live_preparation', label: 'Facebook Canlı Yayın Hazırlığı', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_event_creation', label: 'Facebook Tədbir Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_page_management', label: 'Facebook Səhifə İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_group_management', label: 'Facebook Qrup İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_ads_creation', label: 'Facebook Reklam Hazırlama', subcategoryKey: 'social_media_campaign', categoryKey: 'social_media' },
  { key: 'facebook_marketplace_setup', label: 'Facebook Marketplace Quraşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_messenger_setup', label: 'Facebook Messenger Bot Quraşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_analytics_review', label: 'Facebook Analitika Yoxlaması', subcategoryKey: 'social_media_analysis', categoryKey: 'social_media' },
  { key: 'facebook_community_management', label: 'Facebook İcma İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_content_review', label: 'Facebook Məzmun Yoxlaması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_publishing', label: 'Facebook Yayımlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'facebook_scheduling', label: 'Facebook Planlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  // TikTok Specific Tasks
  { key: 'tiktok_script_writing', label: 'TikTok Ssenari Yazma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_video_editing', label: 'TikTok Video Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_music_selection', label: 'TikTok Musiqi Seçimi', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_effects_selection', label: 'TikTok Effekt Seçimi', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_duet_creation', label: 'TikTok Duet Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_stitch_creation', label: 'TikTok Stitch Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_live_preparation', label: 'TikTok Canlı Yayın Hazırlığı', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_hashtag_research', label: 'TikTok Hashtag Araşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_trend_analysis', label: 'TikTok Trend Analizi', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_challenge_creation', label: 'TikTok Challenge Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_ads_creation', label: 'TikTok Reklam Hazırlama', subcategoryKey: 'social_media_campaign', categoryKey: 'social_media' },
  { key: 'tiktok_spark_ads_setup', label: 'TikTok Spark Ads Quraşdırma', subcategoryKey: 'social_media_campaign', categoryKey: 'social_media' },
  { key: 'tiktok_analytics_review', label: 'TikTok Analitika Yoxlaması', subcategoryKey: 'social_media_analysis', categoryKey: 'social_media' },
  { key: 'tiktok_influencer_management', label: 'TikTok İnfluenser İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_content_review', label: 'TikTok Məzmun Yoxlaması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_publishing', label: 'TikTok Yayımlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'tiktok_scheduling', label: 'TikTok Planlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },

  // YouTube Specific Tasks
  { key: 'youtube_script_writing', label: 'YouTube Ssenari Yazma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_video_editing', label: 'YouTube Video Montaj', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_thumbnail_creation', label: 'YouTube Thumbnail Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_description_writing', label: 'YouTube Təsvir Yazma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_tags_research', label: 'YouTube Etiket Araşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_short_creation', label: 'YouTube Shorts Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_live_preparation', label: 'YouTube Canlı Yayın Hazırlığı', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_premiere_setup', label: 'YouTube Premyera Quraşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_playlist_creation', label: 'YouTube Playlist Hazırlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_community_management', label: 'YouTube İcma Tab İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_channel_management', label: 'YouTube Kanal İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_seo_optimization', label: 'YouTube SEO Optimallaşdırma', subcategoryKey: 'marketing_seo', categoryKey: 'marketing' },
  { key: 'youtube_ads_creation', label: 'YouTube Reklam Hazırlama', subcategoryKey: 'social_media_campaign', categoryKey: 'social_media' },
  { key: 'youtube_monetization_setup', label: 'YouTube Pul Qazanma Quraşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_analytics_review', label: 'YouTube Analitika Yoxlaması', subcategoryKey: 'social_media_analysis', categoryKey: 'social_media' },
  { key: 'youtube_collaboration_management', label: 'YouTube Əməkdaşlıq İdarəetmə', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_content_review', label: 'YouTube Məzmun Yoxlaması', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_publishing', label: 'YouTube Yayımlama', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_scheduling', label: 'YouTube Planlaşdırma', subcategoryKey: 'social_media_post', categoryKey: 'social_media' },
  { key: 'youtube_seo', label: 'YouTube SEO', subcategoryKey: 'marketing_seo', categoryKey: 'marketing' },
  { key: 'pinterest_seo', label: 'Pinterest SEO', subcategoryKey: 'marketing_seo', categoryKey: 'marketing' }
];

// Helper fonksiyonlar
export const getSubtaskByKey = (key: SubtaskKey): Subtask | undefined => {
  return TASK_SUBTASKS.find(subtask => subtask.key === key);
};

export const getSubtasksBySubcategory = (subcategoryKey: TaskSubcategoryKey): Subtask[] => {
  return TASK_SUBTASKS.filter(subtask => subtask.subcategoryKey === subcategoryKey);
};

export const getSubtasksByCategory = (categoryKey: TaskCategoryKey): Subtask[] => {
  return TASK_SUBTASKS.filter(subtask => subtask.categoryKey === categoryKey);
};

export const getSubcategoriesByCategory = (categoryKey: TaskCategoryKey): TaskSubcategory[] => {
  return TASK_SUBCATEGORIES.filter(sub => sub.categoryKey === categoryKey);
};

export const getCategoryBySubcategory = (subcategoryKey: TaskSubcategoryKey): TaskCategoryKey | undefined => {
  const subcategory = TASK_SUBCATEGORIES.find(sub => sub.key === subcategoryKey);
  return subcategory?.categoryKey;
};

// Type Guards
export const isValidTaskCategory = (key: string): key is TaskCategoryKey => {
  return TASK_CATEGORIES.some(cat => cat.key === key);
};

export const isValidTaskSubcategory = (key: string): key is TaskSubcategoryKey => {
  return TASK_SUBCATEGORIES.some(sub => sub.key === key);
};

// Örnek kullanım:
// const socialMediaSubcategories = getSubcategoriesByCategory('social_media');
// const postSubtasks = getSubtasksBySubcategory('social_media_post');
// const allSocialMediaSubtasks = getSubtasksByCategory('social_media');