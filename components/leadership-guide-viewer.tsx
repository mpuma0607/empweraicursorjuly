"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"

const pages = [
  {
    id: 1,
    title: "Leadership Team",
    image: "/images/leadership-team-page1.png",
    description: "Meet the leadership team and organizational structure",
  },
  {
    id: 2,
    title: "Agent Support Team",
    image: "/images/agent-support-team-page2.jpeg",
    description: "Your agent support team and their roles",
  },
  {
    id: 3,
    title: "Contact Information",
    image: "/images/contact-info-page3.png",
    description: "Important contact information and who to contact for what",
  },
]

export function LeadershipGuideViewer() {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length))
    setZoom(100) // Reset zoom when changing pages
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
    setZoom(100) // Reset zoom when changing pages
  }

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    setZoom(100) // Reset zoom when changing pages
  }

  const currentPageData = pages.find((page) => page.id === currentPage)

  return (
    <div className="flex flex-col h-full">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Leadership Team & Contact Guide</h3>
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-800">
              Page {currentPage} of {pages.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 50}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[50px] text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 300}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between p-3 bg-blue-50 border-b">
        <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => goToPage(page.id)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentPage === page.id ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
              }`}
              aria-label={`Go to page ${page.id}`}
            />
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === pages.length}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Navigation Instructions */}
      <div className="p-3 bg-yellow-50 border-b border-yellow-200">
        <p className="text-sm text-yellow-800">
          📋 <strong>Navigation:</strong> Use arrow buttons, click dots, or use page buttons below to navigate •
          Current: {currentPageData?.description}
        </p>
      </div>

      {/* Image viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <div style={{ transform: `scale(${zoom / 100})` }} className="transition-transform duration-200 origin-top">
            <Image
              src={currentPageData?.image || ""}
              alt={`Leadership guide page ${currentPage}: ${currentPageData?.description}`}
              width={1200}
              height={800}
              className="max-w-none shadow-lg rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Page Navigation Buttons */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2 justify-center">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant={currentPage === page.id ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page.id)}
              className="flex-1 max-w-xs"
            >
              {page.id === 1 ? "👥" : page.id === 2 ? "🤝" : "📞"} {page.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Reference Footer */}
      <div className="p-4 border-t bg-blue-50">
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Page 1:</strong> Leadership team organizational chart and structure
          </p>
          <p>
            <strong>Page 2:</strong> Agent support team members and their roles
          </p>
          <p>
            <strong>Page 3:</strong> Contact information and escalation procedures
          </p>
        </div>
      </div>
    </div>
  )
}
