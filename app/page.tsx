"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SlideViewer } from "@/components/SlideViewer";
import { AIAssistant } from "@/components/AIAssistant";
import { Header } from "@/components/Header";
import { ProposalHistory } from "@/components/ProposalHistory";
import axios from "axios";

export interface Slide {
  id: string;
  title: string;
  content: string;
  bulletPoints: string[];
  template: "title" | "content" | "bullets" | "image";
  backgroundColor?: string;
  textColor?: string;
}

export interface Proposal {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  slides: Slide[];
  status: "draft" | "completed";
  originalFile?: string;
  description?: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<
    "upload" | "processing" | "editing"
  >("upload");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("slides :>> ", slides);
  //api call
  const handleFileUpload = async (
    file?: File | string,
    additionalText?: string
  ) => {
    if (!apiUrl) return;

    setIsProcessing(true);
    setCurrentStep("processing");

    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: `Proposal from ${file instanceof File ? file.name : "Text"}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      slides: [],
      status: "draft",
      originalFile: file instanceof File ? file.name : "",
      description: additionalText,
    };

    const doUpload = async (token?: string) => {
      const formData = new FormData();
      if (additionalText) formData.append("job_description", additionalText);
      if (file instanceof File) formData.append("file", file);

      const response = await axios.post(
        // `${apiUrl}agent/build-proposal/`,
        "https://e8ae-49-249-18-30.ngrok-free.app",
        formData
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );

      return response.data;
    };

    try {
      // const token = localStorage.getItem("accessToken");
      // if (!token) throw new Error("Access token missing. Please login again.");

      const data = await doUpload();
   
     // Check if data is a string message, don't update proposals in that case
    if (typeof data === "string") {
      alert(data); // Show the message from backend to the user
      setCurrentStep("upload");
    } else if (data) {
      const fixedSlides = data?.slides.map((slide: any) => ({
        ...slide,
        id: slide.id.toString(), // convert number ID to string
      }));
      // Assume data is slides array here
      
      newProposal.slides = fixedSlides;
      setSlides(fixedSlides);
      setCurrentProposal(newProposal);
      setProposals((prev) => [newProposal, ...prev]);
      setCurrentStep("editing");
    }
    } catch (error: any) {
      console.error("File upload failed:", error);
      alert(
        error.message || "There was an error uploading or processing the file."
      );
      setCurrentStep("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      )
    );

    // Update current proposal
    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides: slides.map((slide) =>
          slide.id === slideId ? { ...slide, ...updates } : slide
        ),
        updatedAt: new Date(),
      };
      setCurrentProposal(updatedProposal);
      setProposals((prev) =>
        prev.map((p) => (p.id === updatedProposal.id ? updatedProposal : p))
      );
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: "New Slide",
      content: "Add your content here...",
      bulletPoints: ["Point 1", "Point 2"],
      template: "content",
    };
    setSlides((prev) => [...prev, newSlide]);

    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides: [...slides, newSlide],
        updatedAt: new Date(),
      };
      setCurrentProposal(updatedProposal);
      setProposals((prev) =>
        prev.map((p) => (p.id === updatedProposal.id ? updatedProposal : p))
      );
    }
  };

  const deleteSlide = (slideId: string) => {
    setSlides((prev) => prev.filter((slide) => slide.id !== slideId));
    if (currentSlideIndex >= slides.length - 1) {
      setCurrentSlideIndex(Math.max(0, slides.length - 2));
    }

    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides: slides.filter((slide) => slide.id !== slideId),
        updatedAt: new Date(),
      };
      setCurrentProposal(updatedProposal);
      setProposals((prev) =>
        prev.map((p) => (p.id === updatedProposal.id ? updatedProposal : p))
      );
    }
  };

  const saveDraft = () => {
    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides,
        status: "draft" as const,
        updatedAt: new Date(),
      };
      setCurrentProposal(updatedProposal);
      setProposals((prev) =>
        prev.map((p) => (p.id === updatedProposal.id ? updatedProposal : p))
      );
      alert("Draft saved successfully!");
    }
  };

  const startNewProposal = () => {
    setCurrentStep("upload");
    setSlides([]);
    setCurrentSlideIndex(0);
    setCurrentProposal(null);
  };

  const loadProposal = (proposal: Proposal) => {
    setCurrentProposal(proposal);
    setSlides(proposal.slides);
    setCurrentSlideIndex(0);
    setCurrentStep("editing");
  };

  const deleteProposal = (proposalId: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    if (currentProposal?.id === proposalId) {
      startNewProposal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* History Sidebar */}
      {showHistory &&  (
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
          <ProposalHistory
            proposals={proposals}
            currentProposal={currentProposal}
            onLoadProposal={loadProposal}
            onDeleteProposal={deleteProposal}
            onNewProposal={startNewProposal}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header
          onToggleHistory={() => setShowHistory(!showHistory)}
          showHistory={showHistory}
          onSaveDraft={currentStep === "editing" ? saveDraft : undefined}
          onNewProposal={startNewProposal}
          currentProposal={currentProposal}
        />

        {currentStep === "upload" && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Create a New Proposal
                </h1>
                <p className="text-xl text-gray-600">
                  Upload your document and add custom requirements to generate a
                  professional presentation
                </p>
              </div>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          </div>
        )}

        {currentStep === "processing" && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Processing Your Document
                </h2>
                <p className="text-gray-600 mb-6">
                  Our AI is analyzing your document and creating a professional
                  presentation...
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === "editing" && (
          <>
            {Array.isArray(slides) && slides.length > 0 ? (
              <div className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                  <SlideViewer
                    slides={slides}
                    currentSlideIndex={currentSlideIndex}
                    onSlideChange={setCurrentSlideIndex}
                    onSlideUpdate={updateSlide}
                    onAddSlide={addSlide}
                    onDeleteSlide={deleteSlide}
                  />
                </div>
                <div className="w-96 border-l border-gray-200">
                  <AIAssistant
                    slides={slides}
                    currentSlideIndex={currentSlideIndex}
                    onSlideUpdate={updateSlide}
                    onAddSlide={addSlide}
                    setSlides={setSlides}
                    setCurrentProposal={setCurrentProposal}
                    currentProposal={currentProposal}
                    setCurrentStep={setCurrentStep}
                    setProposals={setProposals}
                  />
                </div>
              </div>
            ) : typeof slides === "string" ? (
              <div className="p-4 text-center text-gray-600 italic">
                {slides}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-600 italic">
                No slides available.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
