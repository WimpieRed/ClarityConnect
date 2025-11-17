import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { governanceApi } from '../services/api';
import { TermProposal, TermFlag, PaginatedResponse } from '../types';

const GovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'flags'>('proposals');
  const [proposals, setProposals] = useState<TermProposal[]>([]);
  const [flags, setFlags] = useState<TermFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'proposals') {
      loadProposals();
    } else {
      loadFlags();
    }
  }, [activeTab]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<TermProposal> = await governanceApi.proposals.list();
      setProposals(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const loadFlags = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<TermFlag> = await governanceApi.flags.list();
      setFlags(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load flags');
    } finally {
      setLoading(false);
    }
  };

  const handleProposalStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await governanceApi.proposals.updateStatus(id, status);
      loadProposals();
    } catch (err: any) {
      setError(err.message || 'Failed to update proposal status');
    }
  };

  const handleFlagStatusChange = async (id: string, status: 'open' | 'resolved' | 'dismissed') => {
    try {
      await governanceApi.flags.updateStatus(id, status);
      loadFlags();
    } catch (err: any) {
      setError(err.message || 'Failed to update flag status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Governance</h1>
        <Link
          to="/analytics"
          className="text-brand-primary hover:text-brand-dark text-sm"
        >
          View Analytics →
        </Link>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'proposals'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          Proposals
        </button>
        <button
          onClick={() => setActiveTab('flags')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'flags'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          Flags
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      )}

      {loading && <div className="text-center py-8">Loading...</div>}

      {activeTab === 'proposals' && !loading && (
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No proposals found</div>
          ) : (
            proposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-dark">
                      {proposal.proposal_type.charAt(0).toUpperCase() + proposal.proposal_type.slice(1)} Proposal
                    </h3>
                    <p className="text-sm text-gray-500">
                      Status: <span className={`font-medium ${
                        proposal.status === 'approved' ? 'text-green-600' :
                        proposal.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {proposal.status}
                      </span>
                    </p>
                  </div>
                  {proposal.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleProposalStatusChange(proposal.id, 'approved')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProposalStatusChange(proposal.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                {proposal.reason && (
                  <p className="text-gray-700 mb-2">{proposal.reason}</p>
                )}
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(proposal.proposed_data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'flags' && !loading && (
        <div className="space-y-4">
          {flags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No flags found</div>
          ) : (
            flags.map((flag) => (
              <div key={flag.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-dark">
                      {flag.flag_type.charAt(0).toUpperCase() + flag.flag_type.slice(1)} Flag
                    </h3>
                    <p className="text-sm text-gray-500">
                      Status: <span className={`font-medium ${
                        flag.status === 'resolved' ? 'text-green-600' :
                        flag.status === 'dismissed' ? 'text-gray-600' : 'text-yellow-600'
                      }`}>
                        {flag.status}
                      </span>
                    </p>
                  </div>
                  {flag.status === 'open' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleFlagStatusChange(flag.id, 'resolved')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleFlagStatusChange(flag.id, 'dismissed')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-700">{flag.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Term ID: {flag.term_id}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GovernancePage;

