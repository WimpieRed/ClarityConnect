import { useEffect, useState } from 'react';
import { brandingApi } from '../services/api';
import { BrandingConfig } from '../types';

export const useBranding = (organizationId: string = 'default') => {
  const [config, setConfig] = useState<BrandingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const brandingConfig = await brandingApi.get(organizationId);
        setConfig(brandingConfig);
        
        // Apply CSS variables
        document.documentElement.style.setProperty('--color-light', brandingConfig.light_color);
        document.documentElement.style.setProperty('--color-pastel', brandingConfig.pastel_color);
        document.documentElement.style.setProperty('--color-primary', brandingConfig.primary_color);
        document.documentElement.style.setProperty('--color-dark', brandingConfig.dark_color);
      } catch (error) {
        console.error('Failed to load branding config:', error);
        // Use defaults
        document.documentElement.style.setProperty('--color-light', '#EAF9E7');
        document.documentElement.style.setProperty('--color-pastel', '#C0E6BA');
        document.documentElement.style.setProperty('--color-primary', '#4CA771');
        document.documentElement.style.setProperty('--color-dark', '#013237');
      } finally {
        setLoading(false);
      }
    };

    loadBranding();
  }, [organizationId]);

  return { config, loading };
};

