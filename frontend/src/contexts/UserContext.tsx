import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  department: string;
  setDepartment: (department: string) => void;
  userName: string;
  userEmail: string;
  userRole: 'viewer' | 'editor' | 'admin';
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'clarityconnect_user_department';
const USER_NAME_KEY = 'clarityconnect_user_name';
const USER_EMAIL_KEY = 'clarityconnect_user_email';
const USER_ROLE_KEY = 'clarityconnect_user_role';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [department, setDepartmentState] = useState<string>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || '';
  });

  const [userName] = useState<string>(() => {
    return localStorage.getItem(USER_NAME_KEY) || 'John Doe';
  });

  const [userEmail] = useState<string>(() => {
    return localStorage.getItem(USER_EMAIL_KEY) || 'john.doe@nedbank.co.za';
  });

  const [userRole] = useState<'viewer' | 'editor' | 'admin'>(() => {
    return (localStorage.getItem(USER_ROLE_KEY) as 'viewer' | 'editor' | 'admin') || 'viewer';
  });

  const setDepartment = (dept: string) => {
    setDepartmentState(dept);
    if (dept) {
      localStorage.setItem(STORAGE_KEY, dept);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <UserContext.Provider value={{ department, setDepartment, userName, userEmail, userRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

