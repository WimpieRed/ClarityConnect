import React, { useState, useEffect } from 'react';
import { termsApi } from '../../services/api';
import { Term, PaginatedResponse } from '../../types';

interface AdvancedSearchProps {
  onResults: (results: Term[], total: number) => void;
  onSearch: (query: string) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResults, onSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [cluster, setCluster] = useState('');
  const [system, setSystem] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [clusters, setClusters] = useState<string[]>([]);
  const [systems, setSystems] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{ name: string; query: string; filters: any }>>([]);

  useEffect(() => {
    loadFacets();
    loadSavedSearches();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      loadSuggestions();
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const loadFacets = async () => {
    try {
      const response = await termsApi.list({ limit: 1000 });
      const uniqueCategories = [...new Set(response.data.map(t => t.category).filter(Boolean))] as string[];
      const uniqueTags = [...new Set(response.data.flatMap(t => t.tags || []))];
      
      // Extract clusters and systems from contexts
      const allClusters: string[] = [];
      const allSystems: string[] = [];
      response.data.forEach(term => {
        term.contexts?.forEach(ctx => {
          if (ctx.cluster) allClusters.push(ctx.cluster);
          if (ctx.system) allSystems.push(ctx.system);
        });
      });
      
      setCategories(uniqueCategories);
      setClusters([...new Set(allClusters)]);
      setSystems([...new Set(allSystems)]);
      setAllTags(uniqueTags);
    } catch (error) {
      console.error('Failed to load facets:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await termsApi.list({ limit: 10 });
      const termNames = response.data
        .map(t => t.term)
        .filter(t => t.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(termNames);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const loadSavedSearches = () => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      const response: PaginatedResponse<Term> = await termsApi.list({
        limit: 100,
        offset: 0,
        category: category || undefined,
      });

      // Apply client-side filtering for cluster/system/tags
      let filtered = response.data;
      
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(t => 
          t.term.toLowerCase().includes(q) ||
          t.base_definition.toLowerCase().includes(q) ||
          t.tags?.some(tag => tag.toLowerCase().includes(q))
        );
      }

      if (cluster) {
        filtered = filtered.filter(t => 
          t.contexts?.some(ctx => ctx.cluster === cluster)
        );
      }

      if (system) {
        filtered = filtered.filter(t => 
          t.contexts?.some(ctx => ctx.system === system)
        );
      }

      if (tags.length > 0) {
        filtered = filtered.filter(t => 
          tags.some(tag => t.tags?.includes(tag))
        );
      }

      onResults(filtered, filtered.length);
      onSearch(query);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveSearch = () => {
    const searchName = prompt('Enter a name for this search:');
    if (searchName) {
      const newSearch = {
        name: searchName,
        query,
        filters: { category, cluster, system, tags },
      };
      const updated = [...savedSearches, newSearch];
      setSavedSearches(updated);
      localStorage.setItem('savedSearches', JSON.stringify(updated));
    }
  };

  const handleLoadSearch = (savedSearch: typeof savedSearches[0]) => {
    setQuery(savedSearch.query);
    setCategory(savedSearch.filters.category || '');
    setCluster(savedSearch.filters.cluster || '');
    setSystem(savedSearch.filters.system || '');
    setTags(savedSearch.filters.tags || []);
    handleSearch();
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setCluster('');
    setSystem('');
    setTags([]);
    handleSearch();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSearch}>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms, definitions, or tags..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary pr-20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Search
            </button>
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    setSuggestions([]);
                    handleSearch();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-brand-light"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-brand-pastel text-brand-dark rounded-lg hover:bg-opacity-80 transition-colors"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button
            type="button"
            onClick={handleSaveSearch}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        {savedSearches.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-brand-dark mb-2">Saved Searches:</label>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((search, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSearch(search)}
                  className="px-3 py-1 bg-brand-light text-brand-dark rounded-full text-sm hover:bg-brand-pastel transition-colors"
                >
                  {search.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-brand-light rounded-lg">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Cluster</label>
              <select
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">All Clusters</option>
                {clusters.map(cl => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">System</label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">All Systems</option>
                {systems.map(sys => (
                  <option key={sys} value={sys}>{sys}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  list="tags-list"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Add tag..."
                />
                <datalist id="tags-list">
                  {allTags.map(tag => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  +
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-brand-pastel text-brand-dark rounded text-xs flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-brand-dark hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

