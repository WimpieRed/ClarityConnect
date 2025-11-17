import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { termsApi, versionsApi } from '../services/api';
import { Term, VersionComparison } from '../types';
import { mockTerms } from '../services/mockData';
import { TermDetailSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton';
import { FavoriteButton } from '../components/Favorites/FavoriteButton';
import { CommentsSection } from '../components/Comments/CommentsSection';
import { VersionHistory } from '../components/VersionHistory/VersionHistory';
import { VersionComparison as VersionComparisonComponent } from '../components/VersionHistory/VersionComparison';

const TermDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [term, setTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [comparison, setComparison] = useState<VersionComparison | null>(null);

  useEffect(() => {
    if (id) {
      loadTerm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTerm = async () => {
    try {
      setLoading(true);
      const termData = await termsApi.get(id!);
      setTerm(termData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load term');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <TermDetailSkeleton />;
  }

  if (error || !term) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error || 'Term not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/terms"
          className="text-brand-primary hover:text-brand-dark"
        >
          ← Back to Glossary
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showVersionHistory ? 'Hide' : 'Show'} Version History
          </button>
          <Link
            to={`/terms/${term.id}/edit`}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Edit Term
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-brand-dark">{term.term}</h1>
            <FavoriteButton termId={term.id} />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {term.category && (
            <span className="px-3 py-1 bg-brand-pastel text-brand-dark rounded-full text-sm">
              {term.category}
            </span>
          )}
          {term.code_name && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">
              Code: {term.code_name}
            </span>
          )}
          {term.compliance_frameworks && term.compliance_frameworks.length > 0 && (
            <>
              {term.compliance_frameworks.map((framework, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {framework}
                </span>
              ))}
            </>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-2">Definition</h2>
          <p className="text-gray-700">{term.base_definition}</p>
        </div>

        {term.tags && term.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {term.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-brand-pastel text-brand-dark rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {term.contexts && term.contexts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Contextual Variations</h2>
            <div className="space-y-4">
              {term.contexts.map((context) => (
                <div key={context.id} className="border-l-4 border-brand-primary pl-4 py-2 bg-brand-light rounded">
                  {(context.cluster || context.system || context.product) && (
                    <div className="text-sm text-gray-600 mb-1">
                      {context.cluster && <span className="mr-2">Cluster: {context.cluster}</span>}
                      {context.system && <span className="mr-2">System: {context.system}</span>}
                      {context.product && <span>Product: {context.product}</span>}
                      {context.compliance_required && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          Compliance Required
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-gray-700 mb-2">{context.context_definition}</p>
                  {context.business_rules && context.business_rules.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <h3 className="text-sm font-semibold text-brand-dark mb-2">Business Rules</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {context.business_rules.map((rule, idx) => (
                          <li key={idx} className="text-sm text-gray-700">{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {term.examples && term.examples.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Examples</h2>
            <div className="space-y-3">
              {term.examples.map((example) => (
                <div key={example.id} className="bg-brand-light p-4 rounded-lg">
                  <p className="text-gray-700">{example.example_text}</p>
                  {example.source && (
                    <p className="text-sm text-gray-500 mt-2">Source: {example.source}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {term.relationships && term.relationships.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Related Terms</h2>
            <div className="space-y-2">
              {term.relationships.map((rel) => {
                // Find related term from mock data if not loaded
                const relatedTerm = rel.related_term || (rel.related_term_id ? 
                  mockTerms.find((t: Term) => t.id === rel.related_term_id) : null);
                
                return (
                  <div key={rel.id} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 capitalize">{rel.relationship_type}:</span>
                    {relatedTerm ? (
                      <Link
                        to={`/terms/${rel.related_term_id}`}
                        className="text-brand-primary hover:text-brand-dark"
                      >
                        {relatedTerm.term}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{rel.related_term_id}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Version History Section */}
      {showVersionHistory && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4">Version History</h2>
          <VersionHistory
            termId={term.id}
            onViewVersion={() => {
              // Version viewing handled in VersionHistory component
            }}
            onCompareVersion={async (version) => {
              try {
                // Get current term as latest version for comparison
                const versions = await versionsApi.list(term.id);
                if (versions.length > 0) {
                  const latestVersion = versions[0];
                  const comp = await versionsApi.compare(version.id, latestVersion.id);
                  setComparison(comp);
                }
              } catch (err: any) {
                alert(err.message || 'Failed to load comparison');
              }
            }}
            onRollback={async (version) => {
              if (window.confirm(`Are you sure you want to rollback to version ${version.version_number}? This will create a new version with the current state first.`)) {
                try {
                  await versionsApi.rollback(term.id, version.id);
                  await loadTerm(); // Reload term after rollback
                  alert('Term rolled back successfully');
                } catch (err: any) {
                  alert(err.message || 'Failed to rollback term');
                }
              }
            }}
          />
        </div>
      )}

      {/* Version Comparison Modal */}
      {comparison && (
        <VersionComparisonComponent
          comparison={comparison}
          onClose={() => setComparison(null)}
        />
      )}

      <CommentsSection termId={term.id} />
    </div>
  );
};

export default TermDetailPage;

