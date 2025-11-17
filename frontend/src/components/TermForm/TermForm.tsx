import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { termsApi } from '../../services/api';
import { CreateTermRequest, UpdateTermRequest } from '../../types';

interface TermFormProps {
  termId?: string;
  onSuccess?: () => void;
}

export const TermForm: React.FC<TermFormProps> = ({ termId, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTermRequest>({
    term: '',
    base_definition: '',
    category: '',
    code_name: '',
    tags: [],
    compliance_frameworks: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [complianceInput, setComplianceInput] = useState('');

  const isEditMode = !!termId;

  useEffect(() => {
    if (termId) {
      loadTerm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termId]);

  const loadTerm = async () => {
    try {
      setLoading(true);
      const term = await termsApi.get(termId!);
      setFormData({
        term: term.term,
        base_definition: term.base_definition,
        category: term.category || '',
        code_name: term.code_name || '',
        tags: term.tags || [],
        compliance_frameworks: term.compliance_frameworks || [],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load term');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.term.trim()) {
      setError('Term name is required');
      return;
    }
    if (!formData.base_definition.trim()) {
      setError('Definition is required');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        const updateData: UpdateTermRequest = {
          term: formData.term,
          base_definition: formData.base_definition,
          category: formData.category || undefined,
          code_name: formData.code_name || undefined,
          tags: formData.tags,
          compliance_frameworks: formData.compliance_frameworks,
        };
        await termsApi.update(termId!, updateData);
      } else {
        await termsApi.create(formData);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/terms');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save term');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  const handleAddComplianceFramework = () => {
    if (complianceInput.trim() && !formData.compliance_frameworks?.includes(complianceInput.trim())) {
      setFormData({
        ...formData,
        compliance_frameworks: [...(formData.compliance_frameworks || []), complianceInput.trim()],
      });
      setComplianceInput('');
    }
  };

  const handleRemoveComplianceFramework = (frameworkToRemove: string) => {
    setFormData({
      ...formData,
      compliance_frameworks: formData.compliance_frameworks?.filter(fw => fw !== frameworkToRemove) || [],
    });
  };

  if (loading && isEditMode) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">
        {isEditMode ? 'Edit Term' : 'Create New Term'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <div className="flex items-start">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="term" className="block text-sm font-medium text-brand-dark mb-2">
            Term Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="term"
            value={formData.term}
            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
            placeholder="e.g., KYC, API Gateway"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="definition" className="block text-sm font-medium text-brand-dark mb-2">
            Definition <span className="text-red-500">*</span>
          </label>
          <textarea
            id="definition"
            value={formData.base_definition}
            onChange={(e) => setFormData({ ...formData, base_definition: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
            placeholder="Enter the definition of this term..."
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-brand-dark mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            placeholder="e.g., Compliance, Technology, Data & Analytics"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="code_name" className="block text-sm font-medium text-brand-dark mb-2">
            Code Name
          </label>
          <input
            type="text"
            id="code_name"
            value={formData.code_name}
            onChange={(e) => setFormData({ ...formData, code_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            placeholder="e.g., api/v1/terms, SYSTEM_CODE, endpoint_name (for IT definitions)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: System identifier, API endpoint, or code reference for sourcing data
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Tags
          </label>
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-brand-pastel text-brand-dark rounded-full text-sm flex items-center gap-2"
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Compliance Frameworks
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={complianceInput}
              onChange={(e) => setComplianceInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddComplianceFramework();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              placeholder="e.g., BCBS 239, GDPR, FICA"
            />
            <button
              type="button"
              onClick={handleAddComplianceFramework}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.compliance_frameworks && formData.compliance_frameworks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.compliance_frameworks.map((framework, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
                >
                  {framework}
                  <button
                    type="button"
                    onClick={() => handleRemoveComplianceFramework(framework)}
                    className="text-purple-800 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/terms')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Term' : 'Create Term'}
          </button>
        </div>
      </form>
    </div>
  );
};

