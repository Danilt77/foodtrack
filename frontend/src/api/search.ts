import api from "@/api/client"

const SEARCH_URL = "foodtrack/products/search/"

export async function searchProducts(searchQuery: string) {
  const response = await api.get(SEARCH_URL, { params: { q: searchQuery } })
  return response.data
}
