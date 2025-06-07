'use client';

import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Send, Paperclip, X, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file?: File, additionalText?: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [error, setError] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    setIsDragOver(false);
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid document file (PDF, DOC, DOCX, TXT)');
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    noClick: true,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false)
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError('');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSubmit = () => {
    const trimmedText = inputText.trim();
  
    if (uploadedFile && trimmedText) {
      // Both file and text present
      onFileUpload(uploadedFile, trimmedText);
    } else if (uploadedFile) {
      // Only file
      onFileUpload(uploadedFile);
    } else if (trimmedText) {
      // Only text
      onFileUpload(undefined, trimmedText);
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = uploadedFile || inputText.trim();

  return (
    <div className="max-w-4xl mx-auto">

      {/* Chat-style Input Area */}
      <div 
        {...getRootProps()}
        className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
          isDragOver || isDragActive 
            ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
        />

        {/* Drag Overlay */}
        {(isDragOver || isDragActive) && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-90 rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <Paperclip className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-700 font-medium">Drop your document here</p>
            </div>
          </div>
        )}

        {/* File Attachment Display */}
        {uploadedFile && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Text Input Area */}
        <div className="p-4">
          <div className="flex items-end space-x-3">
            {/* Attachment Button */}
            <button
              onClick={handleFileSelect}
              className="flex-shrink-0 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group"
              title="Attach document"
            >
              <Paperclip className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
            </button>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={uploadedFile 
                  ? "Add any specific requirements or context for your presentation..." 
                  : "Describe what you want to create a presentation about, or attach a document..."
                }
                className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                rows={3}
                style={{ minHeight: '60px', maxHeight: '200px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Generate presentation"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>
              {uploadedFile 
                ? `Document attached: ${uploadedFile.name}` 
                : "Supports PDF, DOC, DOCX, TXT files up to 50MB"
              }
            </span>
            <span className="text-xs">
              Press Enter to send, Shift+Enter for new line
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Example Prompts */}
      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-4 text-center">Or try one of these examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Create a business proposal presentation for a new product launch",
            "Generate slides from my research paper about climate change",
            "Make a presentation about quarterly sales performance",
            "Create training slides for new employee onboarding"
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setInputText(example)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-sm text-gray-700"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Paperclip className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Document Analysis</h3>
          <p className="text-sm text-gray-600">
            Upload any document and our AI will extract key insights and structure them into professional slides
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Custom Requirements</h3>
          <p className="text-sm text-gray-600">
            Describe your specific needs and context to get tailored presentations that match your goals
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Send className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Generation</h3>
          <p className="text-sm text-gray-600">
            Get professional presentations in seconds with AI-powered content creation and design
          </p>
        </div>
      </div> */}
    </div>
  );
}