import Details from "./components/sections/Details"
import { getPackageItemService } from "@/services/server/package.service"
import { notFound } from "next/navigation"

type Params = Promise<{ slug: string }>

export default async function PackageDetailPage({ params }: { params: Params }) {
  const { slug } = await params

  let packageData = null
  try {
    const response = await getPackageItemService(slug)
    packageData = response.data // Extract the data property from the response
  } catch (error) {
    console.error("Error fetching package:", error)
    notFound()
  }

  if (!packageData) {
    notFound()
  }

  return (
    <div>
      <Details item={packageData} />
    </div>
  )
}
