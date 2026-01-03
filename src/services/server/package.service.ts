import type { Package, PackageSection } from "@/types/package.type"
import type { PaginatedResponse } from "@/types/response.type"
import { get } from "@/utils/apiClient"

export const getPackageService = async (
  params: {
    page?: number
    page_size?: number
    query?: string
    category?: string
    min_price?: number
    max_price?: number
    delivery_min?: number
    delivery_max?: number
    sort?: string
    package_type?: string
  } = {},
) => {
  try {
    const response = await get<PaginatedResponse<Package>>("/api/packages/", {
      params: params as Record<string, string | number | string[] | number[]>,
    })
    return response
  } catch (error) {
    console.error("Error fetching packages from API:", error)
    throw error
  }
}

export const getPackageHeroSectionService = async () => {
  const response = await get<PackageSection[]>("/api/pages/package/hero/")
  return response
}

export const getPackageItemService = async (slug: string) => {
  try {
    console.log(`Fetching package with slug: ${slug}`)
    const response = await get<Package>(`/api/packages/${slug}/`)
    console.log("Package item response:", response)
    return response
  } catch (error: any) {
    console.error("Error in getPackageItemService:")
    console.error("Error message:", error.message)

    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
      console.error("Response headers:", error.response.headers)
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Error setting up request:", error.message)
    }

    throw new Error(`Failed to fetch package: ${error.message}`)
  }
}
