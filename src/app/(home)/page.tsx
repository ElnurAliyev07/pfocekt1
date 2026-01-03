import { Suspense } from 'react';
import { getCategoriesSectionService, getContactSectionService, getExpertSectionService, getHeroSectionService, getHowToWorkSectionService, getPartnerSectionService, getStatisticSectionService, getTestimonialsService } from "@/services/server/home.service";
import InitialLoading from '@/components/ui/loading/InitialLoading';
import HomePage from './HomePage';


export default async function Home() {
  const heroData = await getHeroSectionService();
  const partnerListData = await getPartnerSectionService();
  const howToWorkListData = await getHowToWorkSectionService();
  const categoriesListData = await getCategoriesSectionService();
  const statisticListData = await getStatisticSectionService();
  const getTestimonials = await getTestimonialsService();
  const expertSectionData = await getExpertSectionService();
  const contactSectionData = await getContactSectionService();
   
  return (
    // <Suspense fallback={<InitialLoading />}>
      <HomePage
        heroData={heroData.data}
        partnerListData={partnerListData.data}
        howToWorkListData={howToWorkListData.data}
        categoriesListData={categoriesListData.data}
        statisticListData={statisticListData.data}
        getTestimonials={getTestimonials.data}
        expertSectionData={expertSectionData.data}
        contactSectionData={contactSectionData.data}
      />
    // </Suspense>
  );
}
