import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { termsApi, usageApi } from '../services/api';
import { Term } from '../types';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState({ totalTerms: 0, recentTerms: [] as Term[] });
  const [recentlyViewed, setRecentlyViewed] = useState<Array<{ term_id: string; term: string; base_definition: string }>>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await termsApi.list({ limit: 5 });
        const allTerms = await termsApi.list({ limit: 10000 });
        setStats({
          totalTerms: allTerms.total,
          recentTerms: response.data.slice(0, 3),
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    const loadRecentlyViewed = async () => {
      try {
        const response = await usageApi.getRecentlyViewed(5);
        setRecentlyViewed(response.data);
      } catch (error) {
        console.error('Failed to load recently viewed:', error);
      }
    };

    loadStats();
    loadRecentlyViewed();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mb-3 sm:mb-4">
          Welcome to ClarityConnect
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-3 sm:mb-4 px-4">
          A shared, searchable platform to help teams speak the same language
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd+K</kbd> to search quickly
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Link
            to="/search"
            className="bg-brand-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-opacity-90 transition-colors text-center font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            🔍 Start Searching
          </Link>
          <Link
            to="/terms"
            className="bg-white text-brand-primary border-2 border-brand-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-brand-pastel transition-colors text-center font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            📚 Browse Glossary
          </Link>
          <Link
            to="/gap-analysis"
            className="bg-brand-pastel text-brand-dark border-2 border-brand-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-opacity-80 transition-colors text-center font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            🔎 Gap Analysis
          </Link>
        </div>
      </div>

      {stats.totalTerms > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">{stats.totalTerms}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Total Terms</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">
                {stats.recentTerms.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Recently Added</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">∞</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Contexts Mapped</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📖</div>
          <h2 className="text-lg sm:text-xl font-semibold text-brand-dark mb-2">Unified Glossary</h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Central source for business and technical definitions across your organization
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🗺️</div>
          <h2 className="text-lg sm:text-xl font-semibold text-brand-dark mb-2">Contextual Mapping</h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            See how terms vary in meaning across different clusters and systems
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🔍</div>
          <h2 className="text-lg sm:text-xl font-semibold text-brand-dark mb-2">Smart Search</h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Quick lookup of related terms, business rules, and real-world examples
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {stats.recentTerms.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-brand-dark mb-3 sm:mb-4">Recently Added Terms</h2>
            <div className="space-y-2 sm:space-y-3">
              {stats.recentTerms.map((term) => (
                <Link
                  key={term.id}
                  to={`/terms/${term.id}`}
                  className="block p-2.5 sm:p-3 rounded-lg hover:bg-brand-light transition-colors"
                >
                  <div className="font-medium text-brand-primary text-sm sm:text-base">{term.term}</div>
                  <div className="text-xs sm:text-sm text-gray-600 line-clamp-1">{term.base_definition}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-brand-dark mb-3 sm:mb-4">Recently Viewed Terms</h2>
            <div className="space-y-2 sm:space-y-3">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.term_id}
                  to={`/terms/${item.term_id}`}
                  className="block p-2.5 sm:p-3 rounded-lg hover:bg-brand-light transition-colors"
                >
                  <div className="font-medium text-brand-primary text-sm sm:text-base">{item.term}</div>
                  <div className="text-xs sm:text-sm text-gray-600 line-clamp-1">{item.base_definition}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

