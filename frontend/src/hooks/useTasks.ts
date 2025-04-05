import { useEffect, useState } from 'react';
import { getTasksByProject } from '../lib/api';
import { tasks as mockTasks } from '../lib/mockData';

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getTasksByProject(projectId)
      .then(data => {
        if (isMounted) {
          setTasks(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('API error, falling back to mock data:', err);
        if (isMounted) {
          setTasks(mockTasks.filter(t => t.projectId === Number(projectId)));
          setError('Using mock data due to API error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [projectId]);

  return { tasks, loading, error };
}