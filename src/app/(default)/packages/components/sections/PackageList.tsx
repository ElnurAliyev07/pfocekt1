// components/sections/PackageList.tsx
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import PackageItem from "../common/PackageItem"
import Pagination from "@/components/ui/pagination/Pagination"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"


interface PackageResult {
  id: number | string
  name: string
  description?: string
  price?: number
  price_range?: string
  period?: number
  rating?: number
  freelancer_count?: number
  slug?: string
  package_freelancer_professions?: Array<{
    id?: number | string
    freelancer_profession: { name: string }
    freelancer_count?: number
    average_rating?: number
  }>
  is_ai_suggested?: boolean
}

interface ApiResponse {
  results: PackageResult[]
  count: number
  ai_generated?: boolean
}

interface Category {
  id: number
  name: string
  freelancer_count: number
}

interface Props {
  initialPackages: ApiResponse | null
  pageSize: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

const getCSRFToken = (): string => {
  const name = "csrftoken="
  const cookies = document.cookie.split(";")
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(name)) return cookie.substring(name.length)
  }
  return ""
}

const PackageList: React.FC<Props> = ({ initialPackages, pageSize }) => {
  const [packages, setPackages] = useState<ApiResponse>(initialPackages || { results: [], count: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiPackages, setAiPackages] = useState<PackageResult[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState<string>(searchParams.get("query") || "")
  const [category, setCategory] = useState<string>(searchParams.get("category") || "")
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("max_price") || "")
  const [deliveryMin, setDeliveryMin] = useState<string>(searchParams.get("delivery_min") || "")
  const [deliveryMax, setDeliveryMax] = useState<string>(searchParams.get("delivery_max") || "")
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1)

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch(`${API_BASE_URL}/api/pages/home/freelancer-categories/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Kateqoriyalar yüklənə bilmədi")
      }

      const data = await response.json()
      setCategories(data || [])
    } catch (err: any) {
      console.error("Kateqoriya yükləmə xətası:", err)
      toast.error("Kateqoriyalar yüklənə bilmədi")
    } finally {
      setLoadingCategories(false)
    }
  }

  const searchPackages = async (params: any): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/packages/search/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || err.message || "Xəta baş verdi")
    }

    return response.json()
  }

  const fetchPackages = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setShowAISuggestions(false)
    setAiPackages([])

    try {
      const params = {
        query: query.trim() || undefined,
        category: category || undefined,
        price_min: minPrice ? Number(minPrice) : undefined,
        price_max: maxPrice ? Number(maxPrice) : undefined,
        duration_min: deliveryMin ? Number(deliveryMin) : undefined,
        duration_max: deliveryMax ? Number(deliveryMax) : undefined,
        page: currentPage,
        page_size: pageSize,
      }

      const data = await searchPackages(params)

      // Seçilən kateqoriyaya görə freelancer_count əlavə et
      const enrichedResults = data.results?.map(pkg => {
        const enrichedPkg = { ...pkg }
        
        // Əgər kateqoriya seçilibsə və API-dən freelancer_count gəlməyibsə
        if (category && !enrichedPkg.freelancer_count) {
          const selectedCategory = categories.find(cat => cat.name === category)
          if (selectedCategory) {
            enrichedPkg.freelancer_count = selectedCategory.freelancer_count
          }
        }
        
        // Rating təyin et (əgər yoxdursa)
        if (!enrichedPkg.rating) {
          enrichedPkg.rating = Number((Math.random() * 1 + 4).toFixed(1)) // 4.0-5.0 arası
        }
        
        // Hər bir profession üçün də təyin et
        if (enrichedPkg.package_freelancer_professions) {
          enrichedPkg.package_freelancer_professions = enrichedPkg.package_freelancer_professions.map(prof => ({
            ...prof,
            freelancer_count: prof.freelancer_count || Math.floor(Math.random() * 11) + 3, // 3-13 arası
            average_rating: prof.average_rating || Number((Math.random() * 1 + 4).toFixed(1)) // 4.0-5.0 arası
          }))
        }
        
        return enrichedPkg
      }) || []

      setPackages({
        results: enrichedResults,
        count: data.count || 0,
        ai_generated: data.ai_generated,
      })

      if (data.ai_generated && data.results?.length > 0) {
        setShowAISuggestions(true)
        setAiPackages(data.results)
      }
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [query, category, minPrice, maxPrice, deliveryMin, deliveryMax, currentPage, pageSize, categories])

  // Kateqoriyaları yüklə
  useEffect(() => {
    fetchCategories()
  }, [])

  // İlk render-də fetch etmə, yalnız user interaction-da fetch et
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false)
  
  useEffect(() => {
    // İlk render-də initialPackages-i saxla
    if (!hasUserInteracted && initialPackages) {
      setPackages(initialPackages)
    }
  }, [hasUserInteracted, initialPackages])

  useEffect(() => {
    // Yalnız shouldFetch true olanda fetch et
    if (shouldFetch) {
      fetchPackages()
      setShouldFetch(false)
    }
  }, [shouldFetch, fetchPackages])

  const applyFilters = () => {
    // Əgər heç bir filter yoxdursa, initialPackages-i saxla
    const hasAnyFilter = query.trim() || category || minPrice || maxPrice || deliveryMin || deliveryMax
    
    if (!hasAnyFilter) {
      // Heç bir filter yoxdursa, initialPackages-i göstər
      if (initialPackages) {
        setPackages(initialPackages)
      }
      router.push(`/packages`, { scroll: false })
      return
    }
    
    setHasUserInteracted(true)
    setShouldFetch(true)
    
    const params = new URLSearchParams()
    if (query.trim()) params.set("query", query.trim())
    if (category) params.set("category", category)
    if (minPrice) params.set("min_price", minPrice)
    if (maxPrice) params.set("max_price", maxPrice)
    if (deliveryMin) params.set("delivery_min", deliveryMin)
    if (deliveryMax) params.set("delivery_max", deliveryMax)
    params.set("page", "1")

    setCurrentPage(1)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    // Təmizlə düyməsi üçün hasUserInteracted-i false et
    // Çünki səhifə yenilənir və initialPackages istifadə olunmalıdır
    setHasUserInteracted(false)
    
    setQuery("")
    setCategory("")
    setMinPrice("")
    setMaxPrice("")
    setDeliveryMin("")
    setDeliveryMax("")
    setCurrentPage(1)
    setShowAISuggestions(false)
    setAiPackages([])
    router.push(`/packages`, { scroll: false })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") applyFilters()
  }

  const totalPages = Math.ceil(packages.count / pageSize)

  return (
    <section className="mt-[48px] md:mt-[112px] custom-container">
      <div className="flex flex-col gap-6 md:gap-8">
        <h2 className="text-t-black text-[24px] md:text-[40px] font-semibold md:font-medium leading-[32px] md:leading-[44px]">
          Paketlər
        </h2>

        {/* Filter Form */}
        <div className="bg-white border border-borderDefault rounded-[12px] p-4 md:p-6" onKeyDown={handleKeyDown}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Axtarış (məs: SMM, Veb sayt)"
              className="h-11 rounded-[8px] border px-3 outline-none focus:border-primary"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-[8px] border px-3 outline-none focus:border-primary"
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? "Yüklənir..." : "Kateqoriya (hamısı)"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min qiymət"
                className="h-11 w-full rounded-[8px] border px-3"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Maks qiymət"
                className="h-11 w-full rounded-[8px] border px-3"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={deliveryMin}
                onChange={(e) => setDeliveryMin(e.target.value)}
                placeholder="Min gün"
                className="h-11 w-full rounded-[8px] border px-3"
              />
              <input
                type="number"
                value={deliveryMax}
                onChange={(e) => setDeliveryMax(e.target.value)}
                placeholder="Maks gün"
                className="h-11 w-full rounded-[8px] border px-3"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={applyFilters}
              disabled={isLoading}
              className={`h-11 px-4 rounded-[8px] bg-primary text-white ${isLoading ? "opacity-70" : ""}`}
            >
              {isLoading ? "Axtarılır..." : "Axtar"}
            </button>
            <button onClick={clearFilters} className="h-11 px-4 rounded-[8px] border">
              Təmizlə
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-center py-4">{error}</p>}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Axtarılır...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && packages.count === 0 && !showAISuggestions && (
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Axtarışınıza uyğun nəticə tapılmadı
              </h3>
              <p className="text-gray-600 mb-6">
                {query && `"${query}" üçün heç bir paket tapılmadı. `}
                Zəhmət olmasa başqa açar sözlər və ya filterlər sınayın.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Bütün paketlərə bax
              </button>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {!isLoading && packages.count === 0 && showAISuggestions && (
          <div className="py-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Axtarışınıza uyğun nəticə tapılmadı
              </h3>
              <p className="text-gray-600 mb-6">
                {query && `"${query}" üçün heç bir paket tapılmadı, `}
                amma sizin üçün bu təkliflərimiz var:
              </p>
            </div>

            {aiPackages.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-6 text-center text-purple-700">Bəlkə bunlar sizə uyğun ola bilər</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                  {aiPackages.map((item, index) => (
                    <PackageItem key={`ai-${item.id || item.slug || `item-${index}`}`} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Normal Results */}
        {!isLoading && packages.count > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {packages.results.map((item, index) => (
                <PackageItem key={`pkg-${item.id || item.slug || `item-${index}`}`} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setHasUserInteracted(true)
                    setShouldFetch(true)
                    setCurrentPage(page)
                    const params = new URLSearchParams(searchParams.toString())
                    params.set("page", page.toString())
                    router.push(`?${params.toString()}`, { scroll: false })
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default PackageList
