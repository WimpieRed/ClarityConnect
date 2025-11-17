import { Term } from '../types';

export const exportToCSV = (terms: Term[]) => {
  const headers = ['Term', 'Definition', 'Category', 'Tags', 'Created At', 'Updated At'];
  const rows = terms.map(term => [
    term.term,
    term.base_definition,
    term.category || '',
    (term.tags || []).join('; '),
    new Date(term.created_at).toLocaleDateString(),
    new Date(term.updated_at).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `clarityconnect-glossary-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (terms: Term[]) => {
  const dataStr = JSON.stringify(terms, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `clarityconnect-glossary-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromCSV = async (file: File): Promise<Term[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        const terms: Term[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
          const term: Partial<Term> = {
            term: values[0] || '',
            base_definition: values[1] || '',
            category: values[2] || undefined,
            tags: values[3] ? values[3].split(';').map(t => t.trim()) : [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          if (term.term && term.base_definition) {
            terms.push(term as Term);
          }
        }
        resolve(terms);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const exportToPDF = async (terms: Term[]) => {
  // Simple PDF export using window.print() for now
  // In production, you'd use a library like jsPDF or pdfmake
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ClarityConnect Glossary Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #013237; }
          .term { margin-bottom: 20px; page-break-inside: avoid; }
          .term-name { font-weight: bold; font-size: 18px; color: #4CA771; }
          .term-definition { margin: 10px 0; }
          .term-meta { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>ClarityConnect Glossary</h1>
        <p>Exported on ${new Date().toLocaleString()}</p>
        ${terms.map(term => `
          <div class="term">
            <div class="term-name">${term.term}</div>
            <div class="term-definition">${term.base_definition}</div>
            <div class="term-meta">
              ${term.category ? `Category: ${term.category} | ` : ''}
              ${term.tags && term.tags.length > 0 ? `Tags: ${term.tags.join(', ')}` : ''}
            </div>
          </div>
        `).join('')}
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

