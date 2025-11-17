import React from 'react';
import { Link } from 'react-router-dom';
import { Term } from '../../types';

interface ClusterTermsProps {
  terms: Term[];
  loading?: boolean;
}

export const ClusterTerms: React.FC<ClusterTermsProps> = ({ terms, loading }) => {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading terms...</div>;
  }

  if (terms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No terms found for this cluster</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
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
                Contexts
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {term.contexts?.length || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-200">
        {terms.map((term) => (
          <div key={term.id} className="p-4 hover:bg-brand-light">
            <Link
              to={`/terms/${term.id}`}
              className="text-brand-primary hover:text-brand-dark font-medium text-lg block mb-2"
            >
              {term.term}
            </Link>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{term.base_definition}</p>
            {term.category && (
              <div className="mb-2">
                <span className="text-xs text-gray-500">Category: </span>
                <span className="text-xs text-gray-700">{term.category}</span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Contexts: {term.contexts?.length || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

