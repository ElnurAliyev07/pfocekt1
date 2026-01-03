import { getDocumentsService } from "@/services/client/documents.service";
import { DocumentStore } from "@/types/documentStore.type";
import { create } from "zustand";

export const useDocumentStore = create<DocumentStore>((set, get) => ({
    documents: [],
    page: 1,
    pageSize: 10,
    searchQuery: "",
    type: "",
    totalPages: 0,
    fetchDocuments: async (reset = false) => {
        const { page, pageSize, searchQuery, type } = get();
        try {
          const currentPage = reset ? 1 : page; // Reset varsa ilk sayfa
          const response = await getDocumentsService(currentPage, pageSize, searchQuery, type); // API'den veriyi çek
          const dynamicTotalPages = Math.ceil(response.data.count / pageSize); // Sayfa sayısını hesapla
          set({
            documents: response.data.results,
            page: currentPage, 
            totalPages: dynamicTotalPages
          });
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      },
    setType: (type) => set({ type }),
    setPage(page) {
        set({ page: page });
    },
 }));