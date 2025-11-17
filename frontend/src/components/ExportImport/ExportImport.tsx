import React, { useState } from 'react';
import { termsApi } from '../../services/api';
import { Term } from '../../types';
import { exportToCSV, exportToJSON, exportToPDF, importFromCSV } from '../../utils/exportUtils';

interface ExportImportProps {
  onImportComplete?: () => void;
}

export const ExportImport: React.FC<ExportImportProps> = ({ onImportComplete }) => {
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const response = await termsApi.list({ limit: 10000 });
      const terms = response.data;

      switch (format) {
        case 'csv':
          exportToCSV(terms);
          break;
        case 'json':
          exportToJSON(terms);
          break;
        case 'pdf':
          await exportToPDF(terms);
          break;
      }
    } catch (error: any) {
      console.error('Export failed:', error);
      alert('Failed to export glossary: ' + error.message);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setImportError('Please select a CSV file');
      return;
    }

    try {
      setImporting(true);
      setImportError(null);
      setImportSuccess(false);

      const terms = await importFromCSV(file);
      
      // Import each term
      for (const term of terms) {
        try {
          await termsApi.create({
            term: term.term,
            base_definition: term.base_definition,
            category: term.category,
            tags: term.tags,
          });
        } catch (error) {
          console.error(`Failed to import term ${term.term}:`, error);
        }
      }

      setImportSuccess(true);
      if (onImportComplete) {
        onImportComplete();
      }
      
      // Reset file input
      e.target.value = '';
    } catch (error: any) {
      setImportError(error.message || 'Failed to import file');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">Export / Import</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-brand-dark mb-3">Export Glossary</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Export to CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Export to JSON
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Export to PDF
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-dark mb-3">Import Glossary</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                Select CSV file to import
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                disabled={importing}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-opacity-90 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                CSV format: Term, Definition, Category, Tags (semicolon-separated)
              </p>
            </div>

            {importing && (
              <div className="text-brand-primary">Importing terms...</div>
            )}

            {importError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                {importError}
              </div>
            )}

            {importSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                Terms imported successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

