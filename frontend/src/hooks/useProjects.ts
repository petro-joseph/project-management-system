import { useEffect, useState } from 'react';
import { getProjects } from '../lib/api';
import { projects as mockProjects } from '../lib/mockData';

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getProjects()
      .then(data => {
        if (isMounted) {
          setProjects(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('API error, falling back to mock data:', err);
        if (isMounted) {
          setProjects(mockProjects);
          setError('Using mock data due to API error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { projects, loading, error };
}