import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// HSE-specific API services
export const hseApi = {
  // Dashboard
  getDashboardStats: () => api.get('/dashboard/stats'),
  
  // Incidents
  getIncidents: (params?: any) => api.get('/incidents', { params }),
  createIncident: (data: any) => api.post('/incidents', data),
  getIncident: (id: string) => api.get(`/incidents/${id}`),
  updateIncident: (id: string, data: any) => api.put(`/incidents/${id}`, data),
  deleteIncident: (id: string) => api.delete(`/incidents/${id}`),
  
  // Risk Assessment
  getRiskMatrix: () => api.get('/risks/matrix'),
  getRiskAssessments: (params?: any) => api.get('/risks/assessments', { params }),
  createRiskAssessment: (data: any) => api.post('/risks/assessments', data),
  getRiskAssessment: (id: string) => api.get(`/risks/assessments/${id}`),
  updateRiskAssessment: (id: string, data: any) => api.put(`/risks/assessments/${id}`, data),
  
  // Permits
  getPermits: (params?: any) => api.get('/permits', { params }),
  getActivePermits: () => api.get('/permits/active'),
  createPermit: (data: any) => api.post('/permits', data),
  getPermit: (id: string) => api.get(`/permits/${id}`),
  updatePermit: (id: string, data: any) => api.put(`/permits/${id}`, data),
  approvePermit: (id: string) => api.post(`/permits/${id}/approve`),
  closePermit: (id: string) => api.post(`/permits/${id}/close`),
  
  // Training
  getTrainingRecords: (params?: any) => api.get('/training', { params }),
  getTrainingCompliance: () => api.get('/training/compliance'),
  createTrainingRecord: (data: any) => api.post('/training', data),
  
  // Documents
  getDocuments: (params?: any) => api.get('/documents', { params }),
  uploadDocument: (formData: FormData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadDocument: (id: string) => api.get(`/documents/${id}/download`, {
    responseType: 'blob'
  }),
  
  // Analytics
  getAnalytics: (params?: any) => api.get('/analytics', { params }),
  getIncidentTrends: () => api.get('/analytics/incident-trends'),
  getRiskHeatmap: () => api.get('/analytics/risk-heatmap'),
  getComplianceMetrics: () => api.get('/analytics/compliance-metrics'),
}

// Authentication services
export const authApi = {
  login: (credentials: { username: string; password: string }) => 
    api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getCurrentUser: () => api.get('/auth/me'),
}