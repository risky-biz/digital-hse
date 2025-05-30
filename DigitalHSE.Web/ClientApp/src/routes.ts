import React from 'react'

// Dashboard
const HSEDashboard = React.lazy(() => import('./views/dashboard/HSEDashboard'))

// Incidents
const IncidentList = React.lazy(() => import('./views/incidents/IncidentListEnhanced'))
const IncidentForm = React.lazy(() => import('./views/incidents/IncidentFormEnhanced'))
const IncidentDetails = React.lazy(() => import('./views/incidents/IncidentDetailsEnhanced'))
const IncidentInvestigation = React.lazy(() => import('./views/incidents/IncidentInvestigation'))
const IncidentDebug = React.lazy(() => import('./views/incidents/IncidentDebug'))
const IncidentTest = React.lazy(() => import('./views/incidents/IncidentTest'))

// Risk Management
const RiskMatrix = React.lazy(() => import('./views/risk-assessment/RiskMatrix'))
const RiskAssessments = React.lazy(() => import('./views/risk-assessment/RiskAssessments'))
const RiskAssessmentForm = React.lazy(() => import('./views/risk-assessment/RiskAssessmentForm'))

// Permits
const PermitList = React.lazy(() => import('./views/permits/PermitList'))
const PermitForm = React.lazy(() => import('./views/permits/PermitForm'))

// Training
const TrainingDashboard = React.lazy(() => import('./views/training/TrainingDashboard'))
const TrainingRecords = React.lazy(() => import('./views/training/TrainingRecords'))

// Documents
const DocumentLibrary = React.lazy(() => import('./views/documents/DocumentLibrary'))

// Compliance
const ComplianceDashboard = React.lazy(() => import('./views/compliance/ComplianceDashboard'))

// Analytics
const AnalyticsDashboard = React.lazy(() => import('./views/analytics/AnalyticsDashboard'))

export interface Route {
  path: string
  exact?: boolean
  name: string
  element: React.ComponentType<any>
}

const routes: Route[] = [
  { path: '/', exact: true, name: 'Home', element: HSEDashboard },
  { path: '/dashboard', name: 'Dashboard', element: HSEDashboard },
  
  // Incidents
  { path: '/incidents', exact: true, name: 'Incidents', element: IncidentList },
  { path: '/incidents/list', name: 'Incident List', element: IncidentList },
  { path: '/incidents/new', name: 'Report Incident', element: IncidentForm },
  { path: '/incidents/debug', name: 'Debug', element: IncidentDebug },
  { path: '/incidents/test', name: 'Test API', element: IncidentTest },
  { path: '/incidents/:id/investigation', name: 'Investigation', element: IncidentInvestigation },
  { path: '/incidents/:id', name: 'Incident Details', element: IncidentDetails },
  
  // Risk Management
  { path: '/risks/matrix', name: 'Risk Matrix', element: RiskMatrix },
  { path: '/risks/assessments', name: 'Risk Assessments', element: RiskAssessments },
  { path: '/risks/assessments/new', name: 'New Risk Assessment', element: RiskAssessmentForm },
  
  // Permits
  { path: '/permits', exact: true, name: 'Permits', element: PermitList },
  { path: '/permits/new', name: 'New Permit', element: PermitForm },
  
  // Training
  { path: '/training', exact: true, name: 'Training', element: TrainingDashboard },
  { path: '/training/records', name: 'Training Records', element: TrainingRecords },
  
  // Documents
  { path: '/documents', name: 'Documents', element: DocumentLibrary },
  
  // Compliance
  { path: '/compliance', name: 'Compliance', element: ComplianceDashboard },
  
  // Analytics
  { path: '/analytics', name: 'Analytics', element: AnalyticsDashboard },
]

export default routes