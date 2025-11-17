import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { termsApi } from '../services/api';
import { Term, PaginatedResponse } from '../types';
import { TermListSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton';
import { ExportImportCompact } from '../components/ExportImport/ExportImportCompact';
import { useUser } from '../contexts/UserContext';

const TermsPage: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('');
  const [showAll, setShowAll] = useState(false);
  const [savedDepartment, setSavedDepartment] = useState<string>('');
  const { department, setDepartment } = useUser();
  const limit = 20;

  // Sync department with showAll toggle
  useEffect(() => {
    if (showAll && department) {
      // Save current department before clearing
      setSavedDepartment(department);
      setDepartment('');
    } else if (!showAll && savedDepartment) {
      // Restore saved department when toggle is off
      setDepartment(savedDepartment);
      setSavedDepartment('');
    }
  }, [showAll]);

  useEffect(() => {
    loadTerms();
  }, [page, category, showAll, department]);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Term> = await termsApi.list({
        limit,
        offset: (page - 1) * limit,
        category: category || undefined,
      });
      setTerms(response.data);
      setTotal(response.total);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load terms');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">Glossary</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <ExportImportCompact onImportComplete={loadTerms} />
          <Link
            to="/terms/new"
            className="bg-brand-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap text-sm sm:text-base flex-1 sm:flex-initial text-center"
          >
            + Add New Term
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto sm:min-w-[200px] md:w-64 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        {department && (
          <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => {
                setShowAll(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary flex-shrink-0"
            />
            <span className="text-xs sm:text-sm text-gray-700">Show all terms</span>
          </label>
        )}
      </div>

      {loading && <TermListSkeleton />}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Error Loading Terms</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={loadTerms}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
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
                      Definition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                      Code Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {terms.map((term) => (
                    <tr key={term.id} className="hover:bg-brand-light">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/terms/${term.id}`}
                          className="text-brand-primary hover:text-brand-dark font-medium"
                        >
                          {term.term}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 line-clamp-2">
                          {term.base_definition}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {term.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {term.code_name ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                            {term.code_name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {term.tags?.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-brand-pastel text-brand-dark rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet/Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {terms.map((term) => (
                <div key={term.id} className="p-4 hover:bg-brand-light">
                  <Link
                    to={`/terms/${term.id}`}
                    className="text-brand-primary hover:text-brand-dark font-medium text-lg block mb-2"
                  >
                    {term.term}
                  </Link>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {term.base_definition}
                  </p>
                  {term.category && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Category: </span>
                      <span className="text-xs text-gray-700">{term.category}</span>
                    </div>
                  )}
                  {term.code_name && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Code: </span>
                      <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {term.code_name}
                      </span>
                    </div>
                  )}
                  {term.tags && term.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {term.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-brand-pastel text-brand-dark rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-light text-sm sm:text-base w-full sm:w-auto"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm sm:text-base text-center">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-light text-sm sm:text-base w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TermsPage;

