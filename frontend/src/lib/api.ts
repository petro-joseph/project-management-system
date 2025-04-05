const API_BASE = '/api';

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Auth
export const login = (email: string, password: string) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getCurrentUser = () => request('/auth/me');

// Users
export const getUsers = () => request('/users');
export const getUser = (id: string) => request(`/users/${id}`);

// Projects
export const getProjects = () => request('/projects');
export const getProject = (id: string) => request(`/projects/${id}`);

// Tasks
export const getTasksByProject = (projectId: string) => request(`/projects/${projectId}/tasks`);
export const getTask = (id: string) => request(`/tasks/${id}`);

// Inventory
export const getInventoryItems = () => request('/inventory');
export const getInventoryItem = (id: number) => request(`/inventory/${id}`);

// Suppliers & Locations (if separate endpoints added later)
export const getSuppliers = () => request('/suppliers');
export const getLocations = () => request('/locations');

// Fixed Assets
export const getFixedAssets = () => request('/assets/fixed-assets');
export const getFixedAsset = (id: string) => request(`/assets/fixed-assets/${id}`);
export const getAssetCategories = () => request('/assets/asset-categories');

// Activity Log
export const getRecentActivities = () => request('/activities/recent');
export const getUserActivities = (userId: string) => request(`/activities/user/${userId}`);