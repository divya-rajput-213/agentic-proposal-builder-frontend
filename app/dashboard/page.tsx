"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Eye,
  Share2,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Proposal {
  id: string;
  title: string;
  type: string;
  contentType: string;
  status: "draft" | "completed" | "shared";
  createdAt: string;
  updatedAt: string;
  description: string;
  pdfUrl?: string;
}

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Marketing Campaign Proposal",
    type: "Marketing proposal",
    contentType: "Pitch deck",
    status: "completed",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    description: "Comprehensive marketing strategy for Q2 2024 product launch",
    pdfUrl: "/proposals/marketing-campaign.pdf",
  },
  {
    id: "2",
    title: "Partnership Agreement Draft",
    type: "Partnership proposal",
    contentType: "Proposal",
    status: "draft",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-16",
    description: "Strategic partnership proposal with tech startup",
  },
  {
    id: "3",
    title: "Event Sponsorship Package",
    type: "Event proposal",
    contentType: "One-pager",
    status: "draft",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-13",
    description: "Annual conference sponsorship opportunities",
    pdfUrl: "/proposals/event-sponsorship.pdf",
  },
  {
    id: "4",
    title: "Project Development Proposal",
    type: "Project proposal",
    contentType: "Report",
    status: "completed",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-11",
    description: "Mobile app development project scope and timeline",
    pdfUrl: "/proposals/project-development.pdf",
  },
];

export default function Dashboard() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || proposal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "draft":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "shared":
        return <Share2 className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shared":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDownloadPDF = (proposal: Proposal) => {
    if (proposal.pdfUrl) {
      // In a real app, this would trigger the actual PDF download
      console.log(`Downloading PDF for: ${proposal.title}`);
      alert(`PDF download started for: ${proposal.title}`);
    } else {
      alert("PDF not available for this proposal");
    }
  };

  const handleDeleteProposal = (id: string) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      setProposals((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const ProposalCard = ({ proposal }: { proposal: Proposal }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-purple-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                {proposal.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(proposal.status)}
                <Badge
                  variant="outline"
                  className={getStatusColor(proposal.status)}
                >
                  {proposal.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {proposal.type}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedProposal(proposal)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {proposal.pdfUrl && (
                  <DropdownMenuItem onClick={() => handleDownloadPDF(proposal)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PPT
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => handleDeleteProposal(proposal.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {proposal.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created {new Date(proposal.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {proposal.contentType}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedProposal(proposal)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            {proposal.pdfUrl && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-600"
                onClick={() => handleDownloadPDF(proposal)}
              >
                <Download className="w-4 h-4 mr-1" />
                PPT
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
              Agentic Proposal Builder Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your proposals and drafts
              </p>
            </div>
            <Link href="/">
              <Button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New Proposal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className=" mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Proposals
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {proposals.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {proposals.filter((p) => p.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {proposals.filter((p) => p.status === "draft").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs
            value={filterStatus}
            onValueChange={setFilterStatus}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No proposals found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first proposal"}
            </p>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Proposal
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Proposal Detail Modal */}
      <AnimatePresence>
        {selectedProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProposal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProposal.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedProposal.status)}
                      <Badge
                        variant="outline"
                        className={getStatusColor(selectedProposal.status)}
                      >
                        {selectedProposal.status}
                      </Badge>
                      <Badge variant="outline">{selectedProposal.type}</Badge>
                      <Badge variant="outline">
                        {selectedProposal.contentType}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProposal(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">
                      {selectedProposal.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Created
                      </h3>
                      <p className="text-gray-600">
                        {new Date(
                          selectedProposal.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Last Updated
                      </h3>
                      <p className="text-gray-600">
                        {new Date(
                          selectedProposal.updatedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Proposal
                    </Button>
                    {selectedProposal.pdfUrl && (
                      <Button
                        className="bg-green-600 hover:bg-green-700 flex-1"
                        onClick={() => handleDownloadPDF(selectedProposal)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PPT
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
