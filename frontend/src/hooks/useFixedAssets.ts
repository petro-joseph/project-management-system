import { useEffect, useState } from 'react';
import { getFixedAssets } from '../lib/api';
import { fixedAssets as mockFixedAssets } from '../lib/mockFixedAssets';

export function useFixedAssets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getFixedAssets()
      .then(data => {
        if (isMounted) {
          setAssets(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('API error, falling back to mock data:', err);
        if (isMounted) {
          setAssets(mockFixedAssets);
          setError('Using mock data due to API error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { assets, loading, error };
}