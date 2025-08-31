/**
 * Application configuration
 * Contains environment-specific settings and variables
 */

// Determine if we're in production mode
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1');

// API URL configuration
const API_BASE_URL = isProduction ? '/api' : 'http://localhost:5000/api';

// Export configuration
export default {
  API_BASE_URL,
  isProduction,
  APP_NAME: 'YouTube to Course Converter',
  // Add other configuration variables as needed
};