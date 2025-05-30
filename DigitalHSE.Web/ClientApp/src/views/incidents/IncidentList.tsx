import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
  CAlert,
  CSpinner,
  CTooltip,
  CCallout,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPlus,
  cilPencil,
  cilDescription,
  cilSearch,
  cilFilter,
  cilWarning,
  cilBell,
  cilClock,
  cilChild,
  cilUser,
  cilShieldAlt,
  cilSortAscending,
  cilSortDescending,
  cilExternalLink,
  cilMedicalCross,
  cilPhone,
} from '@coreui/icons'
import { Link } from 'react-router-dom'

interface IncidentData {
  id: number
  incidentNumber: string
  incidentDateTime: string
  reportedDateTime: string
  title: string
  description: string
  type: string
  typeDisplay: string
  severity: string
  severityDisplay: string
  status: string
  statusDisplay: string
  location: string
  department: string
  reportedBy: string
  studentName?: string
  studentClass?: string
  isStudentIncident: boolean
  requiresMedicalAttention: boolean
  parentNotified: boolean
  requiresBPJSReporting: boolean
  requiresMinistryReporting: boolean
  isRegulatoryOverdue: boolean
  regulatoryDeadline?: string
  hasActiveInvestigation: boolean
  isInvestigationOverdue: boolean
  pendingCAPAs: number
  overdueCAPAs: number
  daysOld: number
  isUrgent: boolean
  urgencyReasons: string[]
}

interface FilterOptions {
  searchTerm: string
  type: string
  severity: string
  status: string
  department: string
  isStudentIncident: string
  isUrgent: string
  dateFrom: string
  dateTo: string
}

const IncidentList: React.FC = () => {
  const { t } = useTranslation(['hse', 'common'])
  const [incidents, setIncidents] = useState<IncidentData[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<keyof IncidentData>('incidentDateTime')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    type: '',
    severity: '',
    status: '',
    department: '',
    isStudentIncident: '',
    isUrgent: '',
    dateFrom: '',
    dateTo: ''
  })

  // Mock data with BSJ school-specific incidents
  const mockIncidents: IncidentData[] = [
    {
      id: 1,
      incidentNumber: 'INC-20240115-1234',
      incidentDateTime: '2024-01-15T10:30:00',
      reportedDateTime: '2024-01-15T10:45:00',
      title: 'Student injured during PE class',
      description: 'Student fell while playing basketball and sprained ankle',
      type: 'SportsInjury',
      typeDisplay: 'Sports Injury',
      severity: 'Moderate',
      severityDisplay: 'Moderate',
      status: 'Open',
      statusDisplay: 'Open',
      location: 'Sports Complex - Indoor',
      department: 'Physical Education',
      reportedBy: 'Coach Sarah Wilson',
      studentName: 'Ahmad Rizki',
      studentClass: '8A',
      isStudentIncident: true,
      requiresMedicalAttention: true,
      parentNotified: true,
      requiresBPJSReporting: false,
      requiresMinistryReporting: false,
      isRegulatoryOverdue: false,
      hasActiveInvestigation: true,
      isInvestigationOverdue: false,
      pendingCAPAs: 2,
      overdueCAPAs: 0,
      daysOld: 2,
      isUrgent: true,
      urgencyReasons: ['Medical attention required']
    },
    {
      id: 2,
      incidentNumber: 'INC-20240114-5678',
      incidentDateTime: '2024-01-14T14:20:00',
      reportedDateTime: '2024-01-14T14:25:00',
      title: 'Chemical spill in science laboratory',
      description: 'Hydrochloric acid spilled during chemistry experiment',
      type: 'LaboratoryAccident',
      typeDisplay: 'Laboratory Accident',
      severity: 'Major',
      severityDisplay: 'Major',
      status: 'UnderInvestigation',
      statusDisplay: 'Under Investigation',
      location: 'Science Laboratory Building - Lab 2',
      department: 'Science Department',
      reportedBy: 'Dr. Maria Santos',
      isStudentIncident: false,
      requiresMedicalAttention: false,
      parentNotified: false,
      requiresBPJSReporting: true,
      requiresMinistryReporting: true,
      isRegulatoryOverdue: false,
      regulatoryDeadline: '2024-01-16T14:20:00',
      hasActiveInvestigation: true,
      isInvestigationOverdue: false,
      pendingCAPAs: 3,
      overdueCAPAs: 1,
      daysOld: 3,
      isUrgent: true,
      urgencyReasons: ['High severity incident', '1 overdue corrective actions']
    },
    {
      id: 3,
      incidentNumber: 'INC-20240113-9012',
      incidentDateTime: '2024-01-13T11:15:00',
      reportedDateTime: '2024-01-13T11:30:00',
      title: 'Playground equipment malfunction',
      description: 'Swing chain broke while student was using it',
      type: 'PlaygroundAccident',
      typeDisplay: 'Playground Accident',
      severity: 'Low',
      severityDisplay: 'Low',
      status: 'Closed',
      statusDisplay: 'Closed',
      location: 'Playground - Elementary',
      department: 'Elementary School',
      reportedBy: 'Ms. Linda Chen',
      studentName: 'Sari Dewi',
      studentClass: '3B',
      isStudentIncident: true,
      requiresMedicalAttention: true,
      parentNotified: true,
      requiresBPJSReporting: false,
      requiresMinistryReporting: false,
      isRegulatoryOverdue: false,
      hasActiveInvestigation: false,
      isInvestigationOverdue: false,
      pendingCAPAs: 0,
      overdueCAPAs: 0,
      daysOld: 4,
      isUrgent: false,
      urgencyReasons: []
    },
    {
      id: 4,
      incidentNumber: 'INC-20240112-3456',
      incidentDateTime: '2024-01-12T09:45:00',
      reportedDateTime: '2024-01-12T16:30:00',
      title: 'Bullying incident reported',
      description: 'Student reported being bullied by classmates during break time',
      type: 'BullyingIncident',
      typeDisplay: 'Bullying Incident',
      severity: 'Moderate',
      severityDisplay: 'Moderate',
      status: 'AwaitingApproval',
      statusDisplay: 'Awaiting Approval',
      location: 'Main Building - Middle School Wing',
      department: 'Student Affairs',
      reportedBy: 'Mrs. Indira Sari',
      studentName: 'Budi Santoso',
      studentClass: '7C',
      isStudentIncident: true,
      requiresMedicalAttention: false,
      parentNotified: true,
      requiresBPJSReporting: false,
      requiresMinistryReporting: true,
      isRegulatoryOverdue: true,
      regulatoryDeadline: '2024-01-12T09:45:00',
      hasActiveInvestigation: true,
      isInvestigationOverdue: true,
      pendingCAPAs: 1,
      overdueCAPAs: 0,
      daysOld: 5,
      isUrgent: true,
      urgencyReasons: ['Regulatory reporting overdue', 'Investigation overdue']
    }
  ]

  useEffect(() => {
    // Simulate API call
    const loadIncidents = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIncidents(mockIncidents)
      setFilteredIncidents(mockIncidents)
      setLoading(false)
    }
    
    loadIncidents()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, incidents])

  const applyFilters = () => {
    let filtered = [...incidents]

    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(search) ||
        incident.incidentNumber.toLowerCase().includes(search) ||
        incident.reportedBy.toLowerCase().includes(search) ||
        incident.studentName?.toLowerCase().includes(search) ||
        incident.location.toLowerCase().includes(search)
      )
    }

    if (filters.type) {
      filtered = filtered.filter(incident => incident.type === filters.type)
    }

    if (filters.severity) {
      filtered = filtered.filter(incident => incident.severity === filters.severity)
    }

    if (filters.status) {
      filtered = filtered.filter(incident => incident.status === filters.status)
    }

    if (filters.department) {
      filtered = filtered.filter(incident => incident.department === filters.department)
    }

    if (filters.isStudentIncident) {
      const isStudent = filters.isStudentIncident === 'true'
      filtered = filtered.filter(incident => incident.isStudentIncident === isStudent)
    }

    if (filters.isUrgent === 'true') {
      filtered = filtered.filter(incident => incident.isUrgent)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(incident => 
        new Date(incident.incidentDateTime) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(incident => 
        new Date(incident.incidentDateTime) <= new Date(filters.dateTo)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    setFilteredIncidents(filtered)
    setCurrentPage(1)
  }

  const handleSort = (field: keyof IncidentData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      type: '',
      severity: '',
      status: '',
      department: '',
      isStudentIncident: '',
      isUrgent: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'light'
      case 'Low': return 'info'
      case 'Moderate': return 'warning'
      case 'Major': return 'danger'
      case 'Critical': return 'danger'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'primary'
      case 'UnderInvestigation': return 'warning'
      case 'AwaitingApproval': return 'info'
      case 'Closed': return 'success'
      case 'Cancelled': return 'secondary'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'StudentInjury':
      case 'PlaygroundAccident':
      case 'SportsInjury':
      case 'BehavioralIncident':
      case 'BullyingIncident':
      case 'FieldTripIncident':
        return cilChild
      case 'StaffInjury':
      case 'TeacherInjury':
        return cilUser
      case 'LaboratoryAccident':
        return cilWarning
      default:
        return cilWarning
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const currentIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Statistics
  const urgentCount = incidents.filter(i => i.isUrgent).length
  const overdueCount = incidents.filter(i => i.isRegulatoryOverdue || i.isInvestigationOverdue || i.overdueCAPAs > 0).length
  const studentIncidentCount = incidents.filter(i => i.isStudentIncident).length

  if (loading) {
    return (
      <CRow>
        <CCol xs={12} className="text-center py-5">
          <CSpinner color="primary" />
          <div className="mt-2">Loading incidents...</div>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      {/* Statistics Cards */}
      <CCol xs={12} className="mb-4">
        <CRow>
          <CCol sm={6} lg={3}>
            <CCallout color="primary">
              <div className="text-medium-emphasis small">Total Incidents</div>
              <div className="h4 mb-0">{incidents.length}</div>
            </CCallout>
          </CCol>
          <CCol sm={6} lg={3}>
            <CCallout color="warning">
              <div className="text-medium-emphasis small">Urgent Actions</div>
              <div className="h4 mb-0 d-flex align-items-center">
                {urgentCount}
                {urgentCount > 0 && <CIcon icon={cilBell} className="ms-2" />}
              </div>
            </CCallout>
          </CCol>
          <CCol sm={6} lg={3}>
            <CCallout color="danger">
              <div className="text-medium-emphasis small">Overdue Items</div>
              <div className="h4 mb-0 d-flex align-items-center">
                {overdueCount}
                {overdueCount > 0 && <CIcon icon={cilClock} className="ms-2" />}
              </div>
            </CCallout>
          </CCol>
          <CCol sm={6} lg={3}>
            <CCallout color="info">
              <div className="text-medium-emphasis small">Student Incidents</div>
              <div className="h4 mb-0 d-flex align-items-center">
                {studentIncidentCount}
                <CIcon icon={cilChild} className="ms-2" />
              </div>
            </CCallout>
          </CCol>
        </CRow>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong><CIcon icon={cilWarning} className="me-2" />Incident Management Dashboard</strong>
              <div className="text-medium-emphasis small mt-1">
                BSJ Safety Management System - Monitor and manage all incidents
              </div>
            </div>
            <div className="d-flex gap-2">
              <CButton 
                color="secondary" 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <CIcon icon={cilFilter} className="me-1" />
                Filters
              </CButton>
              <Link to="/incidents/new">
                <CButton color="primary" size="sm">
                  <CIcon icon={cilPlus} className="me-1" />
                  Report Incident
                </CButton>
              </Link>
            </div>
          </CCardHeader>
          
          {showFilters && (
            <CCardBody className="border-bottom bg-light">
              <CRow className="g-3">
                <CCol md={3}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Search incidents..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="StudentInjury">Student Injury</option>
                    <option value="PlaygroundAccident">Playground Accident</option>
                    <option value="SportsInjury">Sports Injury</option>
                    <option value="BehavioralIncident">Behavioral Incident</option>
                    <option value="BullyingIncident">Bullying Incident</option>
                    <option value="LaboratoryAccident">Laboratory Accident</option>
                    <option value="FieldTripIncident">Field Trip Incident</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={filters.severity}
                    onChange={(e) => handleFilterChange('severity', e.target.value)}
                  >
                    <option value="">All Severities</option>
                    <option value="Minor">Minor</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="UnderInvestigation">Under Investigation</option>
                    <option value="AwaitingApproval">Awaiting Approval</option>
                    <option value="Closed">Closed</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={filters.isUrgent}
                    onChange={(e) => handleFilterChange('isUrgent', e.target.value)}
                  >
                    <option value="">All Priorities</option>
                    <option value="true">Urgent Only</option>
                  </CFormSelect>
                </CCol>
                <CCol md={1}>
                  <CButton 
                    color="secondary" 
                    variant="outline"
                    onClick={clearFilters}
                    className="w-100"
                  >
                    Clear
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          )}

          <CCardBody className="p-0">
            <CTable hover responsive className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell 
                    scope="col" 
                    className="cursor-pointer"
                    onClick={() => handleSort('incidentNumber')}
                  >
                    Incident #
                    <CIcon 
                      icon={sortField === 'incidentNumber' 
                        ? (sortDirection === 'asc' ? cilSortAscending : cilSortDescending)
                        : cilSortAscending
                      } 
                      className="ms-1 text-medium-emphasis"
                      size="sm"
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('incidentDateTime')}
                  >
                    Date/Time
                    <CIcon 
                      icon={sortField === 'incidentDateTime' 
                        ? (sortDirection === 'asc' ? cilSortAscending : cilSortDescending)
                        : cilSortAscending
                      } 
                      className="ms-1 text-medium-emphasis"
                      size="sm"
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Incident Details</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Location</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Severity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Reporter</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Alerts</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentIncidents.map((incident) => (
                  <CTableRow key={incident.id} className={incident.isUrgent ? 'border-start border-warning border-3' : ''}>
                    <CTableDataCell>
                      <div className="fw-semibold">{incident.incidentNumber}</div>
                      <small className="text-medium-emphasis">ID: {incident.id}</small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{new Date(incident.incidentDateTime).toLocaleDateString()}</div>
                      <small className="text-medium-emphasis">
                        {new Date(incident.incidentDateTime).toLocaleTimeString()}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-start">
                        <CIcon icon={getTypeIcon(incident.type)} className="me-2 mt-1" />
                        <div>
                          <div className="fw-semibold">{incident.title}</div>
                          <small className="text-medium-emphasis">{incident.typeDisplay}</small>
                          {incident.isStudentIncident && (
                            <div className="mt-1">
                              <CBadge color="info" className="me-1">
                                <CIcon icon={cilChild} className="me-1" size="sm" />
                                {incident.studentName}
                              </CBadge>
                              <small className="text-muted">Class {incident.studentClass}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{incident.location}</div>
                      <small className="text-medium-emphasis">{incident.department}</small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getSeverityColor(incident.severity)}>
                        {incident.severityDisplay}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusColor(incident.status)}>
                        {incident.statusDisplay}
                      </CBadge>
                      {incident.hasActiveInvestigation && (
                        <div className="mt-1">
                          <CBadge color="secondary" className="small">
                            Investigation Active
                          </CBadge>
                        </div>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{incident.reportedBy}</div>
                      <small className="text-medium-emphasis">{incident.daysOld} days ago</small>
                    </CTableDataCell>
                    <CTableDataCell>
                      {incident.isUrgent && (
                        <CTooltip content={incident.urgencyReasons.join(', ')}>
                          <CBadge color="warning" className="d-block mb-1">
                            <CIcon icon={cilBell} className="me-1" size="sm" />
                            Urgent
                          </CBadge>
                        </CTooltip>
                      )}
                      {incident.requiresMedicalAttention && (
                        <CBadge color="danger" className="d-block mb-1">
                          <CIcon icon={cilMedicalCross} className="me-1" size="sm" />
                          Medical
                        </CBadge>
                      )}
                      {incident.parentNotified && incident.isStudentIncident && (
                        <CBadge color="success" className="d-block mb-1">
                          <CIcon icon={cilPhone} className="me-1" size="sm" />
                          Parent Notified
                        </CBadge>
                      )}
                      {(incident.requiresBPJSReporting || incident.requiresMinistryReporting) && (
                        <CBadge color={incident.isRegulatoryOverdue ? 'danger' : 'warning'} className="d-block mb-1">
                          <CIcon icon={cilShieldAlt} className="me-1" size="sm" />
                          Regulatory
                        </CBadge>
                      )}
                      {incident.overdueCAPAs > 0 && (
                        <CBadge color="danger" className="d-block mb-1">
                          <CIcon icon={cilClock} className="me-1" size="sm" />
                          {incident.overdueCAPAs} Overdue CAPA
                        </CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-1">
                        <CTooltip content="View Details">
                          <Link to={`/incidents/${incident.id}`}>
                            <CButton color="primary" variant="ghost" size="sm">
                              <CIcon icon={cilDescription} />
                            </CButton>
                          </Link>
                        </CTooltip>
                        <CTooltip content="Edit Incident">
                          <CButton color="info" variant="ghost" size="sm">
                            <CIcon icon={cilPencil} />
                          </CButton>
                        </CTooltip>
                        {incident.hasActiveInvestigation && (
                          <CTooltip content="View Investigation">
                            <CButton color="warning" variant="ghost" size="sm">
                              <CIcon icon={cilExternalLink} />
                            </CButton>
                          </CTooltip>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
          
          {filteredIncidents.length > itemsPerPage && (
            <CCardBody className="border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-medium-emphasis">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredIncidents.length)} of{' '}
                  {filteredIncidents.length} incidents
                </div>
                <CPagination>
                  <CPaginationItem 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem
                      key={i + 1}
                      active={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            </CCardBody>
          )}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default IncidentList