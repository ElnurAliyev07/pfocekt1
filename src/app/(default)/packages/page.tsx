import PackageList from "./components/sections/PackageList"
import Hero from "./components/sections/Hero"
import { getPackageHeroSectionService, getPackageService } from "@/services/server/package.service"
import { PackageSection } from "@/types/package.type"

type HeroSectionResponse = {
  data: PackageSection[];
  status?: number;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams
  const page = Number(params.page || 1)
  const pageSize = 6

  const filters = {
    page,
    page_size: pageSize,
    query: (params.query as string) || undefined,
    category: (params.category as string) || undefined,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    delivery_min: params.delivery_min ? Number(params.delivery_min) : undefined,
    delivery_max: params.delivery_max ? Number(params.delivery_max) : undefined,
  }

  let packages: { results: any[]; count: number } = { results: [], count: 0 }
  let packageHeroData: HeroSectionResponse = { data: [] }

  try {
    const [packagesResponse, heroResponse] = await Promise.all([
      getPackageService(filters).catch(() => ({ data: { results: [], count: 0 } })),
      getPackageHeroSectionService().catch(() => ({ data: [] as PackageSection[] })),
    ])
    
    packages = {
      results: packagesResponse.data?.results || [],
      count: packagesResponse.data?.count || 0
    }
    packageHeroData = heroResponse
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return (
    <div>
      {packageHeroData.data.length > 0 && <Hero data={packageHeroData.data[0]} />}
      <PackageList initialPackages={packages} pageSize={pageSize} />
    </div>
  )
}

export default Page
