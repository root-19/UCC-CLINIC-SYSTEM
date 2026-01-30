// Environment configuration for client
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'https://clinic-backend-production-8835.up.railway.app',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
};

export default env;

