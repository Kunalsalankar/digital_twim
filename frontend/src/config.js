// API Configuration
const config = {
  development: {
    API_URL: 'http://localhost:3001'
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || window.location.origin
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_URL = config[environment].API_URL;

console.log('🔧 API Configuration:', { environment, API_URL: API_URL });

export default config;
