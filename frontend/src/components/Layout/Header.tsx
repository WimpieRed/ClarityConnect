import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserProfileDropdown } from '../UserProfileDropdown';
import { NotificationBell } from '../Notifications/NotificationBell';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/terms', label: 'Glossary' },
    { path: '/search', label: 'Search' },
    { path: '/governance', label: 'Governance' },
    { path: '/gap-analysis', label: 'Gap Analysis' },
    { path: '/clusters', label: 'Clusters' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/compliance', label: 'Compliance' },
  ];

  return (
    <header className="bg-brand-dark text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold hover:text-brand-pastel transition-colors flex items-center gap-2 flex-shrink-0">
            <span>ClarityConnect</span>
            <span className="text-xs text-brand-pastel hidden lg:inline">Press Ctrl+K to search</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2 lg:px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm lg:text-base ${
                  isActive(link.path) ? 'text-brand-pastel font-medium bg-white/5' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Notifications, User Profile & Mobile Menu Button */}
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationBell />
            <UserProfileDropdown />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-pastel"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 animate-in slide-in-from-top"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${
                    isActive(link.path) ? 'text-brand-pastel font-medium bg-white/5' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
