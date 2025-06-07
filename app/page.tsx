'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SlideViewer } from '@/components/SlideViewer';
import { AIAssistant } from '@/components/AIAssistant';
import { Header } from '@/components/Header';
import { ProposalHistory } from '@/components/ProposalHistory';

export interface Slide {
  id: string;
  title: string;
  content: string;
  bulletPoints: string[];
  template: 'title' | 'content' | 'bullets' | 'image';
}

export interface Proposal {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  slides: Slide[];
  status: 'draft' | 'completed';
  originalFile?: string;
  description?: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'editing'>('upload');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  //api call
  const handleFileUpload = async (file?: File | string, additionalText?: string) => {
    if(!apiUrl){
      return
    }
    setIsProcessing(true);
    setCurrentStep("processing");
  
    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: `Proposal from ${file instanceof File ? file.name : 'Text'}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      slides: [],
      status: "draft",
      originalFile: file instanceof File ? file.name : '',
      description: additionalText,
    };
  
    try {
      const form = new FormData();
      if (additionalText) {
        form.append("job_description", additionalText);
      }
      if (file instanceof File) {
        form.append("file", file);
      }
  
      const response = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload and process file");
      }
  
      const data = await response.json();
      if (data) {
        newProposal.slides = data;
        setSlides(data);
        setCurrentProposal(newProposal);
        setProposals((prev) => [newProposal, ...prev]);
        setCurrentStep("editing");
      }
    } catch (error) {
      console.error("File upload failed:", error);
      alert("There was an error uploading or processing the file.");
      setCurrentStep("upload");
    } finally {
      setIsProcessing(false);
    }
  };
  
  
  

  // const handleFileUpload = async () => {
  //   setIsProcessing(true);
  //   setCurrentStep('processing');
  
  //   const newProposal: Proposal = {
  //     id: Date.now().toString(),
  //     title: `Proposal from Dummy Backend`,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     slides: [],
  //     status: 'draft',
  //     originalFile: 'dummy.txt',
  //     description: 'This is a dummy description for testing'
  //   };
  
  //   try {
  //     // This is the dummy response (you can also move it to a separate file if large)
  //     const dummySlides: Slide[] = [
  //       {
  //         "id": "1",
  //         "title": "Proposal for Food Court App Development",
  //         "content": "This proposal outlines the development of a mobile application for food courts, designed to enhance the customer experience and streamline operations.",
  //         "bulletPoints": [],
  //         "template": "title"
  //       },
  //       {
  //         "id": "2",
  //         "title": "Executive Summary",
  //         "content": "This proposal outlines the development of a mobile application for food courts, designed to enhance the customer experience and streamline operations. The app will allow users to browse menus, order food, make payments, track orders, and provide feedback. For food court vendors, it will offer inventory management, sales tracking, and communication tools. This project aims to create a user-friendly and efficient platform that improves the overall food court experience for both customers and vendors.",
  //         "bulletPoints": [],
  //         "template": "content"
  //       },
  //       {
  //         "id": "3",
  //         "title": "Scope of Work",
  //         "content": "This project encompasses the complete design and development of a food court mobile application, including:",
  //         "bulletPoints": [
  //           "Customer-facing features:",
  //           "Vendor-facing features:",
  //           "Admin Panel:"
  //         ],
  //         "template": "bullets"
  //       },
  //       {
  //         "id": "4",
  //         "title": "Milestones & Timeline",
  //         "content": "The project will be completed in four phases, spanning approximately 12 weeks:",
  //         "bulletPoints": [],
  //         "template": "content"
  //       },
  //       {
  //         "id": "5",
  //         "title": "Resource & Role Breakdown",
  //         "content": "* Project Manager: Oversees the project, manages communication, and ensures timely delivery.\n* UX/UI Designer: Designs the user interface and user experience of the application.\n* Frontend Developer: Develops the customer-facing and vendor-facing interfaces.\n* Backend Developer: Develops the server-side logic and database.\n* QA Tester: Conducts thorough testing to identify and resolve bugs.",
  //         "bulletPoints": [],
  //         "template": "content"
  //       },
  //       {
  //         "id": "6",
  //         "title": "Architecture",
  //         "content": "The application will utilize a three-tier architecture:",
  //         "bulletPoints": [
  //           "Presentation Tier: Mobile app (iOS and Android)",
  //           "Application Tier: RESTful APIs built using [Specify Technology - e.g., Node.js, Python/Django]",
  //           "Data Tier: Cloud-based database (e.g., PostgreSQL, MySQL on AWS/Google Cloud)"
  //         ],
  //         "template": "bullets"
  //       },
  //       {
  //         "id": "7",
  //         "title": "Flow",
  //         "content": "* Customer Flow: Search for food court -> Browse menu -> Add items to cart -> Checkout -> Payment -> Order tracking -> Review & Rating.\n* Vendor Flow: Login -> Manage Inventory -> Accept/Reject orders -> View sales data -> Manage customer communication.\n* Admin Flow: Manage users -> Manage content -> View analytics -> Send push notifications.",
  //         "bulletPoints": [],
  //         "template": "content"
  //       },
  //       {
  //         "id": "8",
  //         "title": "Tech Stack",
  //         "content": "* Frontend: React Native (or Flutter, specify choice based on client preference)\n* Backend: Node.js with Express.js (or Python/Django, specify choice based on client preference)\n* Database: PostgreSQL (or MySQL, specify choice based on client preference)\n* Cloud Platform: AWS (or Google Cloud, Azure, specify choice based on client preference)\n* Payment Gateway: Stripe/PayPal (or other, specify choice based on client preference)",
  //         "bulletPoints": [],
  //         "template": "content"
  //       },
  //       {
  //         "id": "9",
  //         "title": "Deliverables",
  //         "content": "* Fully functional iOS and Android mobile applications.\n* Comprehensive documentation, including user manuals and API specifications.\n* Source code.\n* Post-launch support (specified duration).",
  //         "bulletPoints": [],
  //         "template": "content"
  //       },
  //       {
  //         "id": "10",
  //         "title": "Budget Breakdown",
  //         "content": "| Item                | Cost      |\n|---------------------|------------|\n| Design              | $[Amount]  |\n| Development          | $[Amount]  |\n| Testing             | $[Amount]  |\n| Deployment          | $[Amount]  |\n| Project Management  | $[Amount]  |\n| **Total**           | **$[Total]** |",
  //         "bulletPoints": [],
  //         "template": "content"
  //       },
  //       {
  //         "id": "11",
  //         "title": "Terms & Conditions",
  //         "content": "* Payment Schedule: [Specify payment milestones and schedule]\n* Intellectual Property Rights: [Clearly define ownership of the developed application]\n* Confidentiality: [Outline confidentiality agreements]\n* Warranty: [Specify warranty period and coverage]\n* Dispute Resolution: [Outline procedures for resolving disputes]",
  //         "bulletPoints": [],
  //         "template": "content"
  //       }
  //     ];
  
  //     // Use it just like you would in real API response
  //     newProposal.slides = dummySlides;
  //     setSlides(dummySlides);
  //     setCurrentProposal(newProposal);
  //     setProposals(prev => [newProposal, ...prev]);
  //     setCurrentStep('editing');
  //   } catch (error) {
  //     console.error("Dummy upload error:", error);
  //     alert("Something went wrong with dummy data.");
  //     setCurrentStep('upload');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  
  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    setSlides(prev => prev.map(slide => 
      slide.id === slideId ? { ...slide, ...updates } : slide
    ));
    
    // Update current proposal
    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides: slides.map(slide => 
          slide.id === slideId ? { ...slide, ...updates } : slide
        ),
        updatedAt: new Date()
      };
      setCurrentProposal(updatedProposal);
      setProposals(prev => prev.map(p => 
        p.id === updatedProposal.id ? updatedProposal : p
      ));
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: 'New Slide',
      content: 'Add your content here...',
      bulletPoints: ['Point 1', 'Point 2'],
      template: 'content'
    };
    setSlides(prev => [...prev, newSlide]);
    
    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides: [...slides, newSlide],
        updatedAt: new Date()
      };
      setCurrentProposal(updatedProposal);
      setProposals(prev => prev.map(p => 
        p.id === updatedProposal.id ? updatedProposal : p
      ));
    }
  };

  const deleteSlide = (slideId: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== slideId));
    if (currentSlideIndex >= slides.length - 1) {
      setCurrentSlideIndex(Math.max(0, slides.length - 2));
    }
    
    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides: slides.filter(slide => slide.id !== slideId),
        updatedAt: new Date()
      };
      setCurrentProposal(updatedProposal);
      setProposals(prev => prev.map(p => 
        p.id === updatedProposal.id ? updatedProposal : p
      ));
    }
  };

  const saveDraft = () => {
    if (currentProposal) {
      const updatedProposal = {
        ...currentProposal,
        slides,
        status: 'draft' as const,
        updatedAt: new Date()
      };
      setCurrentProposal(updatedProposal);
      setProposals(prev => prev.map(p => 
        p.id === updatedProposal.id ? updatedProposal : p
      ));
      alert('Draft saved successfully!');
    }
  };

  const startNewProposal = () => {
    setCurrentStep('upload');
    setSlides([]);
    setCurrentSlideIndex(0);
    setCurrentProposal(null);
  };

  const loadProposal = (proposal: Proposal) => {
    setCurrentProposal(proposal);
    setSlides(proposal.slides);
    setCurrentSlideIndex(0);
    setCurrentStep('editing');
  };

  const deleteProposal = (proposalId: string) => {
    setProposals(prev => prev.filter(p => p.id !== proposalId));
    if (currentProposal?.id === proposalId) {
      startNewProposal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* History Sidebar */}
      {showHistory && (
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
          onSaveDraft={currentStep === 'editing' ? saveDraft : undefined}
          onNewProposal={startNewProposal}
          currentProposal={currentProposal}
        />
        
        {currentStep === 'upload' && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Create a New Proposal
                </h1>
                <p className="text-xl text-gray-600">
                  Upload your document and add custom requirements to generate a professional presentation
                </p>
              </div>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          </div>
        )}

        {currentStep === 'processing' && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Document</h2>
                <p className="text-gray-600 mb-6">
                  Our AI is analyzing your document and creating a professional presentation...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'editing' && (
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
        )}
      </div>
    </div>
  );
}