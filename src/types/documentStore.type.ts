import { Document } from "./document.type";

export interface DocumentStore {
    documents: Document[]
    page: number,
    pageSize: number,
    searchQuery: string,
    type: string,
    totalPages: number
    fetchDocuments: (reset?: boolean) => Promise<void>
    setType: (type: string) => void
    setPage: (page: number) => void
}