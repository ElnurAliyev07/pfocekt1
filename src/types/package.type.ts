export interface Package {
    id: number;
    name: string;
    slug: string;
    cover_image: string;
    category: {
      name: string;
    };
    package_freelancer_professions: {
      id: number;
      freelancer_profession: {
        name: string;
      };
      price: number;
      freelancer_count?: number;
      average_rating?: number;
    }[];
    description: string;
    price: number;
    period: number;
    rating: number;
    price_range: string;
    freelancer_count: number;
    package_requirements: {
      id: number;
      requirement: string;
    }[];
    package_portfolios: PackagePortfolio[];
    features?: string[];
    freelancers?: PackageFreelancer[];
    reviews?: PackageReview[];
    similar_packages?: SimilarPackage[];
  }

export interface PackageFreelancer {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  completed_projects: number;
  profession: string;
}

export interface PackageReview {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

export interface SimilarPackage {
  id: number;
  name: string;
  slug: string;
  price: number;
  rating: number;
  period?: number;
  freelancer_count?: number;
}


export interface PackagePortfolio {
    id: number;
    name: string;
    cover_image: string;
    link: string;
}


export interface PackageSection {
  id: number;
  created: string;
  updated: string;
  title: string;
  description: string;
  image: string;
}
