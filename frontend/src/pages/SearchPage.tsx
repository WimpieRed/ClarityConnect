import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdvancedSearch } from '../components/AdvancedSearch/AdvancedSearch';
import { searchApi } from '../services/api';
import { Term, PaginatedResponse } from '../types';
import { SearchResultSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton';
import { useUser } from '../contexts/UserContext';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Term[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [category] = useState('');
  const [cluster] = useState('');
  const [system] = useState('');
  const { department } = useUser();

  // Legacy search handler - kept for compatibility but AdvancedSearch handles search now
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Term> = await searchApi.search({
        q: query,
        category: category || undefined,
        cluster: cluster || undefined,
        system: system || undefined,
        limit: 20,
        offset: 0,
      });
      setResults(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">Search Glossary</h1>
          {department && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Filtering by: <span className="font-medium text-brand-primary">{department}</span>
            </p>
          )}
        </div>
        <Link
          to="/analytics"
          className="text-brand-primary hover:text-brand-dark text-xs sm:text-sm whitespace-nowrap"
        >
          View Analytics →
        </Link>
      </div>

      <AdvancedSearch
        onResults={(results, total) => {
          setResults(results);
          setTotal(total);
          setLoading(false);
        }}
        onSearch={(q) => {
          setQuery(q);
          setLoading(true);
        }}
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Search Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  if (query) handleSearch();
                }}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <SearchResultSkeleton />}

      {!loading && results.length > 0 && (
        <>
          <div className="mb-4 text-gray-600">
            Found {total} result{total !== 1 ? 's' : ''}
          </div>
          <div className="space-y-4">
            {results.map((term) => (
              <div key={term.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <Link
                  to={`/terms/${term.id}`}
                  className="text-xl font-semibold text-brand-primary hover:text-brand-dark mb-2 block"
                >
                  {term.term}
                </Link>
            <p className="text-gray-700 mb-2 line-clamp-2">{term.base_definition}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              {term.category && <span>Category: {term.category}</span>}
              {term.code_name && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                  Code: {term.code_name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {term.tags && term.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {term.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-brand-pastel text-brand-dark rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-brand-dark mb-2">
            No results found for "{query}"
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <div className="text-sm text-gray-500">
            <p className="mb-2">💡 Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spelling</li>
              <li>Try more general terms</li>
              <li>Remove filters to see more results</li>
              <li>Browse the <Link to="/terms" className="text-brand-primary hover:underline">full glossary</Link></li>
            </ul>
          </div>
        </div>
      )}

      {!loading && !query && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔎</div>
          <h3 className="text-xl font-semibold text-brand-dark mb-2">
            Start Your Search
          </h3>
          <p className="text-gray-600 mb-4">
            Use the search bar above to find terms, definitions, and contexts
          </p>
          <div className="text-sm text-gray-500">
            <p className="mb-2">Quick shortcuts:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd+K</kbd> to focus search</li>
              <li>Use filters to narrow results by category, cluster, or system</li>
              <li>Try advanced search for more options</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

