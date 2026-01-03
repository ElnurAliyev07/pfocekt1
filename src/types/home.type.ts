export interface HeroSection {
  id: number;
  title: string;
  description: string;
  image: string;
}
export interface ContactSection {
  id: number;
  created: string;
  updated: string;
  title: string;
  description: string;
  image_overlay: string;
}

export interface ExpertSection  {
  id: number,
  punkts: 
    {
      id: number,
      created: string,
      updated: string,
      title: string | null,
      description: string | null,
      count: string | null,
    }[],
  created: string,
  updated: string,
  image: string,
  title: string,
  description: string | null
}


export interface Partner {
  id: number;
  name: string;
  logo: string;
  url: string;
}

export interface HowToWork {
  id: number;
  title: string;
  description: string;
  file: string;
}

export interface Category {
  id: number;
  name: string;
  file: string;
  small_description: string;
  large_description: string;
  slug: string;
  freelancer_count: number;
}

export interface Statistic {
  id: number;
  title: string;
  number: number;
  file: string;
}

export interface Testimonial {

  id: number
  created: string,
  updated: string,
  customer_name: string,
  location: string,
  profile_image: string,
  title: string,
  comment: string,
  rating: number

}