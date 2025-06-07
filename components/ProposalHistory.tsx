'use client';

import { useState } from 'react';
import { FileText, Calendar, Trash2, Search, Filter } from 'lucide-react';
import { Proposal } from '@/app/page';

interface ProposalHistoryProps {
  proposals: Proposal[];
  currentProposal: Proposal | null;
  onLoadProposal: (proposal: Proposal) => void;
  onDeleteProposal: (proposalId: string) => void;
  onNewProposal: () => void;
}

export function ProposalHistory({
  proposals,
  currentProposal,
  onLoadProposal,
  onDeleteProposal,
  onNewProposal
}: ProposalHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed'>('all');

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || proposal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Proposal History</h2>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'draft' | 'completed')}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="draft">Drafts</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Proposals List */}
      <div className="flex-1">
        {filteredProposals.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No proposals found</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  currentProposal?.id === proposal.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => onLoadProposal(proposal)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {proposal.title}
                    </h3>
                    {proposal.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {proposal.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        proposal.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {proposal.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {proposal.slides.length} slides
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(proposal.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProposal(proposal.id);
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}