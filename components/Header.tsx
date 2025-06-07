import {
  FileText,
  Presentation,
  Sparkles,
  Menu,
  Save,
  Plus,
  History,
} from "lucide-react";
import { Proposal } from "@/app/page";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface HeaderProps {
  onToggleHistory: () => void;
  showHistory: boolean;
  onSaveDraft?: () => void;
  onNewProposal: () => void;
  currentProposal?: Proposal | null;
}

export function Header({
  onToggleHistory,
  showHistory,
  onSaveDraft,
  onNewProposal,
  currentProposal,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleHistory}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={showHistory ? "Hide History" : "Show History"}
            >
              {showHistory ? (
                <Menu className="h-5 w-5" />
              ) : (
                <History className="h-5 w-5" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <Presentation className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Agentic Proposal Builder
                </h1>
                <p className="text-sm text-gray-500">
                  {currentProposal ? currentProposal.title : "Powered by AI"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>AI Enhanced</span>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span> View Dashboard</span>
            </button>
            {onSaveDraft && (
              <button
                onClick={onSaveDraft}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </button>
            )}

          {onSaveDraft&&  <button
              onClick={onNewProposal}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Proposal</span>
            </button>}
            <button
              onClick={() => router.push("/login")}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
