import { useEffect, useState } from 'react';
import { getUsers } from '../lib/api';
import { users as mockUsers } from '../lib/mockData';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getUsers()
      .then(data => {
        if (isMounted) {
          setUsers(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('API error, falling back to mock data:', err);
        if (isMounted) {
          setUsers(mockUsers);
          setError('Using mock data due to API error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { users, loading, error };
}