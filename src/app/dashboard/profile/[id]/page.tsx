
import { notFound } from "next/navigation";
import { getProfileService } from '@/services/server/profile.service'
import ProfilePage from "@/features/dashboard/profile/ProfilePage";

const page = async ({params} : { params: Promise<{ id: number }> }) => {
  const {id} = await params;
  try {
    const getProfileData = await getProfileService({id: Number(id)});

    return (
      <ProfilePage initialUser={getProfileData.data} />  
    )
  } catch {
    notFound();
  }
}

export default page
