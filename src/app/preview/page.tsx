"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PuffLoader } from "react-spinners";

export default function PreviewPage() {
  const [publishedArticles, setPublishedArticles] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 1;

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/article/100/0`);
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();

      const filteredArticles = data.filter(
        (article: any) => article.status === "Publish"
      );

      if (filteredArticles.length > 0) {
        setPublishedArticles(filteredArticles);
        setTotalPages(Math.ceil(filteredArticles.length / limit));
      } else {
        throw new Error("No articles with status 'Publish' found.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <PuffLoader
          color="#1f1f1f"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
      />
    </div>
  );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col w-96 p-6 bg-white text-red-600 rounded-lg border border-red-200 shadow-lg">
          <h3 className="text-lg font-semibold text-red-600 text-center">
            Oops, something went wrong
          </h3>
          <p className="mt-2 text-sm text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );

  const currentPageArticles = publishedArticles.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Articles</h2>

      <div className="space-y-4">
        {currentPageArticles.map((article) => (
          <div key={article.id} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{article.title}</h3>
            <p className="line-clamp-3">{article.content}</p>
            <p className="text-sm text-gray-500">
              Category: {article.category}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
