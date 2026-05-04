// API client setup
// Import: axios
// Features:
// - Create axios instance with baseURL (http://localhost:8080/api/v1)
// - Attach JWT token to every request header
// - Handle 401 errors (token expired - redirect to login)
// - Handle network errors
// - Return axios instance for use in other services
