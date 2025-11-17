import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AccessRequest, Term } from '../types';
import { accessRequestsApi, termsApi } from '../services/api';

const AccessRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [availableTerms, setAvailableTerms] = useState<Term[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadRequests();
    loadAvailableTerms();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await accessRequestsApi.list();
      setRequests(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load access requests');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTerms = async () => {
    try {
      const response = await termsApi.list({ limit: 1000 });
      // Filter terms that are department-restricted (for demo purposes)
      const restrictedTerms = response.data.filter(
        t => t.visibility_type === 'department_restricted'
      );
      setAvailableTerms(restrictedTerms);
    } catch (err) {
      console.error('Failed to load terms:', err);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTermId || !requestReason.trim()) {
      alert('Please select a term and provide a reason');
      return;
    }

    try {
      await accessRequestsApi.create({
        term_id: selectedTermId,
        reason: requestReason,
      });
      setShowRequestForm(false);
      setSelectedTermId('');
      setRequestReason('');
      loadRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to submit request');
    }
  };

  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter(r => r.status === filterStatus);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">Access Requests</h1>
        <button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-brand-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
        >
          {showRequestForm ? 'Cancel' : '+ Request Access'}
        </button>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-dark mb-3 sm:mb-4">Request Access to Term</h2>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Term
              </label>
              <select
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                required
              >
                <option value="">Choose a term...</option>
                {availableTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.term} {term.category && `(${term.category})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Access
              </label>
              <textarea
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                placeholder="Explain why you need access to this term..."
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRequestForm(false);
                  setSelectedTermId('');
                  setRequestReason('');
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            filterStatus === 'all'
              ? 'bg-brand-primary text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({requests.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            filterStatus === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            filterStatus === 'approved'
              ? 'bg-green-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Approved ({requests.filter(r => r.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            filterStatus === 'rejected'
              ? 'bg-red-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Rejected ({requests.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading requests...</div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No access requests found</p>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="text-brand-primary hover:underline"
            >
              View all requests
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-pastel">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Reviewed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-brand-light">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/terms/${request.term_id}`}
                        className="text-brand-primary hover:text-brand-dark font-medium"
                      >
                        {request.term_name || request.term_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 line-clamp-2 max-w-md">
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.reviewed_at
                        ? new Date(request.reviewed_at).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet/Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link
                    to={`/terms/${request.term_id}`}
                    className="text-brand-primary hover:text-brand-dark font-medium text-lg"
                  >
                    {request.term_name || request.term_id}
                  </Link>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{request.reason}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                  {request.reviewed_at && (
                    <span>Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessRequestsPage;

