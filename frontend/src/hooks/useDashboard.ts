import { useEffect, useState } from 'react';
import { getRecentActivities } from '../lib/api';
import { dashboardData as mockDashboardData } from '../lib/mockData';

export function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getRecentActivities()
      .then(activities => {
        if (isMounted) {
          setData({ ...mockDashboardData, recentActivity: activities });
          setError(null);
        }
      })
      .catch(err => {
        console.error('API error, falling back to mock data:', err);
        if (isMounted) {
          setData(mockDashboardData);
          setError('Using mock data due to API error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { data, loading, error };
}