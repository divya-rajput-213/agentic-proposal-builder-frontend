'use client';

import { useState } from 'react';
import { Slide } from '@/app/page';
import { Edit3, Type, List, Image, Layout } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
  isPreviewMode: boolean;
}

export function SlideEditor({ slide, onUpdate, isPreviewMode }: SlideEditorProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const templates = [
    { id: 'title', name: 'Title Slide', icon: Type },
    { id: 'content', name: 'Content', icon: Layout },
    { id: 'bullets', name: 'Bullet Points', icon: List },
    { id: 'image', name: 'Image', icon: Image }
  ];

  const handleBulletPointChange = (index: number, value: string) => {
    const newBulletPoints = [...slide.bulletPoints];
    newBulletPoints[index] = value;
    onUpdate({ bulletPoints: newBulletPoints });
  };

  const addBulletPoint = () => {
    onUpdate({ bulletPoints: [...slide.bulletPoints, 'New point'] });
  };

  const removeBulletPoint = (index: number) => {
    const newBulletPoints = slide.bulletPoints.filter((_, i) => i !== index);
    onUpdate({ bulletPoints: newBulletPoints });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Template selector */}
      {!isPreviewMode && (
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Layout className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Template:</span>
          </div>
          <div className="flex space-x-2">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => onUpdate({ template: template.id as Slide['template'] })}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    slide.template === template.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{template.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Slide content */}
      <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white relative">
        {/* Title */}
        <div className="mb-8">
          {isEditingTitle && !isPreviewMode ? (
            <input
              type="text"
              value={slide.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              className="w-full text-4xl font-bold bg-transparent border-b-2 border-white/50 outline-none"
              autoFocus
            />
          ) : (
            <h1
              className={`text-4xl font-bold ${!isPreviewMode ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => !isPreviewMode && setIsEditingTitle(true)}
            >
              {slide.title}
              {!isPreviewMode && (
                <Edit3 className="h-5 w-5 ml-2 inline opacity-50" />
              )}
            </h1>
          )}
        </div>

        {/* Content based on template */}
        {slide.template === 'title' && (
          <div>
            {isEditingContent && !isPreviewMode ? (
              <textarea
                value={slide.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                onBlur={() => setIsEditingContent(false)}
                className="w-full text-xl bg-transparent border border-white/50 rounded p-2 outline-none resize-none"
                rows={3}
                autoFocus
              />
            ) : (
              <p
                className={`text-xl opacity-90 ${!isPreviewMode ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => !isPreviewMode && setIsEditingContent(true)}
              >
                {slide.content}
                {!isPreviewMode && (
                  <Edit3 className="h-4 w-4 ml-2 inline opacity-50" />
                )}
              </p>
            )}
          </div>
        )}

        {slide.template === 'content' && (
          <div>
            {isEditingContent && !isPreviewMode ? (
              <textarea
                value={slide.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                onBlur={() => setIsEditingContent(false)}
                className="w-full text-lg bg-transparent border border-white/50 rounded p-2 outline-none resize-none"
                rows={6}
                autoFocus
              />
            ) : (
              <p
                className={`text-lg opacity-90 leading-relaxed ${!isPreviewMode ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => !isPreviewMode && setIsEditingContent(true)}
              >
                {slide.content}
                {!isPreviewMode && (
                  <Edit3 className="h-4 w-4 ml-2 inline opacity-50" />
                )}
              </p>
            )}
          </div>
        )}

        {slide.template === 'bullets' && (
          <div>
            <p className="text-xl opacity-90 mb-6">{slide.content}</p>
            <ul className="space-y-3">
              {slide.bulletPoints.map((point, index) => (
                <li key={index} className="flex items-center text-lg">
                  <span className="w-3 h-3 bg-white rounded-full mr-4 flex-shrink-0"></span>
                  {!isPreviewMode ? (
                    <div className="flex-1 flex items-center">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handleBulletPointChange(index, e.target.value)}
                        className="flex-1 bg-transparent border-b border-white/30 outline-none"
                      />
                      <button
                        onClick={() => removeBulletPoint(index)}
                        className="ml-2 text-white/70 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="opacity-90">{point}</span>
                  )}
                </li>
              ))}
            </ul>
            {!isPreviewMode && (
              <button
                onClick={addBulletPoint}
                className="mt-4 text-white/70 hover:text-white text-sm"
              >
                + Add bullet point
              </button>
            )}
          </div>
        )}

        {slide.template === 'image' && (
          <div className="text-center">
            <p className="text-xl opacity-90 mb-8">{slide.content}</p>
            <div className="w-full h-64 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Image className="h-12 w-12 mx-auto mb-2 opacity-70" />
                <p className="opacity-70">Image placeholder</p>
                {!isPreviewMode && (
                  <button className="mt-2 px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30">
                    Upload Image
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}