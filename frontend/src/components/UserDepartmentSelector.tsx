import React from 'react';
import { useUser } from '../contexts/UserContext';

const DEPARTMENTS = [
  '',
  'IT Operations',
  'Platform Engineering',
  'Risk Management',
  'Home Loans',
  'Retail Banking',
  'Customer Onboarding',
  'Data Engineering',
  'Business Intelligence',
  'Credit Management',
  'Corporate and Investment Banking',
  'Private Wealth',
  'Compliance & Regulatory',
  'Legal & Compliance',
  'Treasury Operations',
  'Payments & Settlements',
  'Digital Banking',
];

export const UserDepartmentSelector: React.FC = () => {
  const { department, setDepartment } = useUser();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="department-select" className="text-sm text-white/80">
        Department:
      </label>
      <select
        id="department-select"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="px-3 py-1 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-pastel text-sm"
      >
        <option value="">All Departments</option>
        {DEPARTMENTS.filter(d => d !== '').map((dept) => (
          <option key={dept} value={dept} className="text-gray-900">
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
};

