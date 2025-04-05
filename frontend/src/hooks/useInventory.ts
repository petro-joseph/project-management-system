import { useEffect, useState } from 'react';
import { getInventoryItems } from '../lib/api';
import { getInventoryItems as getMockInventory } from '../lib/mockData';

export function useInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getInventoryItems()
      .then(data => {
        if (isMounted) {
          setItems(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('API error, falling back to mock data:', err);
        if (isMounted) {
          setItems(getMockInventory());
          setError('Using mock data due to API error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { items, loading, error };
}