import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { termsApi } from '../services/api';
import { Term } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { TermListSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteTerms: Term[] = [];
      
      for (const id of favorites) {
        try {
          const term = await termsApi.get(id);
          favoriteTerms.push(term);
        } catch (error) {
          console.error(`Failed to load term ${id}:`, error);
        }
      }
      
      setTerms(favoriteTerms);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <TermListSkeleton />;
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-brand-dark mb-4">My Favorites</h1>
        <p className="text-gray-600 mb-6">You haven't favorited any terms yet.</p>
        <Link
          to="/terms"
          className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors inline-block"
        >
          Browse Glossary
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">My Favorites</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {terms.map((term) => (
            <div key={term.id} className="p-6 hover:bg-brand-light">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link
                    to={`/terms/${term.id}`}
                    className="text-xl font-semibold text-brand-primary hover:text-brand-dark mb-2 block"
                  >
                    {term.term}
                  </Link>
                  <p className="text-gray-700 mb-2 line-clamp-2">{term.base_definition}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {term.category && <span>Category: {term.category}</span>}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;

