import { useEffect, useState } from 'react';
import { getRecentActivities } from '../lib/api';
import { activities as mockActivities } from '../lib/mockData';

export function useActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getRecentActivities()
      .then(data => {
        if (isMounted) {
          setActivities(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('API error, falling back to mock data:', err);
        if (isMounted) {
          setActivities(mockActivities);
          setError('Using mock data due to API error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { activities, loading, error };
}