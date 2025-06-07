"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import { Slide } from "@/app/page";
import { SlideEditor } from "./SlideEditor";
interface SlideViewerProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onSlideUpdate: (slideId: string, updates: Partial<Slide>) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string) => void;
}

export function SlideViewer({
  slides,
  currentSlideIndex,
  onSlideChange,
  onSlideUpdate,
  onAddSlide,
  onDeleteSlide,
}: SlideViewerProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const currentSlide = slides[currentSlideIndex];

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      onSlideChange(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    }
  };

  const exportPresentation = () => {
    // Mock export functionality
    alert(
      "Export feature would be implemented here. This would generate a downloadable PowerPoint file."
    );
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No slides available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm font-medium text-gray-700">
            {currentSlideIndex + 1} of {slides.length}
          </span>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPreviewMode
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Eye className="h-4 w-4 mr-1 inline" />
            {isPreviewMode ? "Edit" : "Preview"}
          </button>

          <button
            onClick={onAddSlide}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-1 inline" />
            Add Slide
          </button>

          <button
            onClick={() => onDeleteSlide(currentSlide.id)}
            disabled={slides.length === 1}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Trash2 className="h-4 w-4 mr-1 inline" />
            Delete
          </button>

          <button
            onClick={exportPresentation}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            <Download className="h-4 w-4 mr-1 inline" />
            Export PPT
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Slide thumbnails */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Slides</h3>

          <div className="space-y-2 overflow-y-auto max-h-[650px] pr-1">
            {slides?.map((slide, index) => (
              <div
                key={slide.id}
                onClick={() => onSlideChange(index)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentSlideIndex
                    ? "bg-blue-100 border-2 border-blue-300"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Slide {index + 1}
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {slide.title}
                </div>
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {slide.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide editor/preview */}
        <div className="flex-1 p-8 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <SlideEditor
              slide={currentSlide}
              onUpdate={(updates) => onSlideUpdate(currentSlide.id, updates)}
              isPreviewMode={isPreviewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
