import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CBadge,
  CAlert,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CSpinner,
  CToast,
  CToastBody,
  CProgress,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilWarning,
  cilUser,
  cilCalendar,
  cilTask,
  cilClipboard,
  cilSave,
  cilPlus,
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilClock,
  cilSearch,
  cilBell,
  cilPeople,
  cilFile,
  cilCamera,
} from '@coreui/icons'

interface InvestigationData {
  id: number
  incidentId: number
  incidentNumber: string
  incidentTitle: string
  leadInvestigator: string
  teamMembers: TeamMember[]
  startDate: string
  targetCompletionDate: string
  actualCompletionDate?: string
  status: string
  progressPercentage: number
  methodology: string
  initialFindings: string
  interviewNotes: string
  evidenceCollected: string
  witnessStatements: string
  rootCauses: string[]
  contributingFactors: string[]
  systemicIssues: string
  immediateActions: string
  shortTermActions: string
  longTermActions: string
  preventiveMeasures: string
}

interface TeamMember {
  name: string
  role: string
  department: string
  email: string
}

interface RCAMethod {
  name: string
  description: string
  template: string
}

const IncidentInvestigation: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['hse', 'common'])
  const [investigation, setInvestigation] = useState<InvestigationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddTeamMember, setShowAddTeamMember] = useState(false)
  const [showRCAModal, setShowRCAModal] = useState(false)
  // Toast notifications can be added here if needed
  
  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({
    name: '',
    role: '',
    department: '',
    email: ''
  })

  // RCA methodologies available in BSJ system
  const rcaMethods: RCAMethod[] = [
    {
      name: '5 Whys',
      description: 'Iterative interrogative technique to explore cause-and-effect relationships',
      template: 'Why did this happen?\n1. Why: \n2. Why: \n3. Why: \n4. Why: \n5. Why: '
    },
    {
      name: 'Fishbone/Ishikawa',
      description: 'Categorizes potential causes to identify root causes',
      template: 'Categories:\n- People: \n- Process: \n- Equipment: \n- Environment: \n- Materials: \n- Management: '
    },
    {
      name: 'Fault Tree Analysis',
      description: 'Top-down approach using Boolean logic to analyze system failures',
      template: 'Top Event: \nImmediate Causes:\n- Cause 1: \n- Cause 2: \nBasic Events:\n- Event 1: \n- Event 2: '
    },
    {
      name: 'Bow-Tie Analysis',
      description: 'Risk evaluation method combining fault tree and event tree analysis',
      template: 'Hazard: \nThreat: \nTop Event: \nPrevention Barriers:\n- Barrier 1: \n- Barrier 2: \nConsequences:\n- Consequence 1: \n- Consequence 2: \nProtection Barriers:\n- Barrier 1: \n- Barrier 2: '
    }
  ]

  // Mock investigation data
  useEffect(() => {
    const loadInvestigation = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setInvestigation({
        id: 1,
        incidentId: parseInt(id || '1'),
        incidentNumber: 'INC-20240115-1234',
        incidentTitle: 'Student injured during PE class',
        leadInvestigator: 'Dr. Ahmad Wijaya',
        teamMembers: [
          { name: 'Dr. Ahmad Wijaya', role: 'Lead Investigator', department: 'Safety Department', email: 'ahmad.wijaya@bsj.sch.id' },
          { name: 'Coach Sarah Wilson', role: 'Witness', department: 'Physical Education', email: 'sarah.wilson@bsj.sch.id' },
          { name: 'Nurse Linda Sari', role: 'Medical Expert', department: 'Health Services', email: 'linda.sari@bsj.sch.id' }
        ],
        startDate: '2024-01-15T11:00:00',
        targetCompletionDate: '2024-01-22T17:00:00',
        status: 'InProgress',
        progressPercentage: 65,
        methodology: '5 Whys',
        initialFindings: 'Student fell while attempting to shoot basketball. No immediate safety hazards observed in the gymnasium.',
        interviewNotes: 'Student reported feeling dizzy before the incident. Coach confirmed proper warm-up was conducted.',
        evidenceCollected: 'Photos of gymnasium floor, basketball court layout, medical examination report',
        witnessStatements: 'Three students witnessed the incident. All confirmed student appeared unsteady before falling.',
        rootCauses: [
          'Student did not report feeling unwell before activity',
          'No pre-activity health check protocol in place'
        ],
        contributingFactors: [
          'Student skipped breakfast',
          'High temperature in gymnasium',
          'Intense warm-up session'
        ],
        systemicIssues: 'Lack of mandatory health declaration before physical activities',
        immediateActions: 'Student received immediate first aid and medical attention',
        shortTermActions: 'Implement pre-activity health check for all PE classes',
        longTermActions: 'Develop comprehensive student health monitoring system',
        preventiveMeasures: 'Regular health screenings, improved gymnasium ventilation, mandatory breakfast program information'
      })
      
      setLoading(false)
    }
    
    loadInvestigation()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      addToast(
        <CToast color="success">
          <CToastBody>Investigation progress saved successfully!</CToastBody>
        </CToast>
      )
    } catch (error) {
      addToast(
        <CToast color="danger">
          <CToastBody>Failed to save investigation progress.</CToastBody>
        </CToast>
      )
    } finally {
      setSaving(false)
    }
  }

  const handleAddTeamMember = () => {
    if (!investigation) return
    
    const updatedTeamMembers = [...investigation.teamMembers, newTeamMember]
    setInvestigation({
      ...investigation,
      teamMembers: updatedTeamMembers
    })
    
    setNewTeamMember({ name: '', role: '', department: '', email: '' })
    setShowAddTeamMember(false)
    
    addToast(
      <CToast color="success">
        <CToastBody>Team member added successfully!</CToastBody>
      </CToast>
    )
  }

  const handleCompleteInvestigation = async () => {
    if (!investigation) return
    
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setInvestigation({
        ...investigation,
        status: 'Completed',
        progressPercentage: 100,
        actualCompletionDate: new Date().toISOString()
      })
      
      addToast(
        <CToast color="success">
          <CToastBody>
            <div className="d-flex align-items-center">
              <CIcon icon={cilCheckCircle} className="me-2" />
              Investigation completed successfully! Report is ready for review.
            </div>
          </CToastBody>
        </CToast>
      )
    } catch (error) {
      addToast(
        <CToast color="danger">
          <CToastBody>Failed to complete investigation.</CToastBody>
        </CToast>
      )
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned': return 'primary'
      case 'InProgress': return 'warning'
      case 'PendingApproval': return 'info'
      case 'Completed': return 'success'
      case 'OnHold': return 'secondary'
      case 'Cancelled': return 'danger'
      default: return 'secondary'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success'
    if (progress >= 60) return 'info'
    if (progress >= 40) return 'warning'
    return 'danger'
  }

  if (loading) {
    return (
      <CRow>
        <CCol xs={12} className="text-center py-5">
          <CSpinner color="primary" />
          <div className="mt-2">Loading investigation details...</div>
        </CCol>
      </CRow>
    )
  }

  if (!investigation) {
    return (
      <CRow>
        <CCol xs={12}>
          <CAlert color="danger">Investigation not found.</CAlert>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      {/* Investigation Header */}
      <CCol xs={12} className="mb-4">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">
                <CIcon icon={cilSearch} className="me-2" />
                Investigation: {investigation.incidentNumber}
              </h4>
              <p className="text-medium-emphasis mb-0">{investigation.incidentTitle}</p>
            </div>
            <div className="d-flex gap-2">
              <CBadge color={getStatusColor(investigation.status)} className="px-3 py-2">
                {investigation.status}
              </CBadge>
              <CButton color="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Save Progress
                  </>
                )}
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={3}>
                <div className="border-end pe-3">
                  <div className="small text-medium-emphasis">Lead Investigator</div>
                  <div className="fw-semibold">{investigation.leadInvestigator}</div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border-end pe-3">
                  <div className="small text-medium-emphasis">Start Date</div>
                  <div className="fw-semibold">
                    {new Date(investigation.startDate).toLocaleDateString()}
                  </div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border-end pe-3">
                  <div className="small text-medium-emphasis">Target Completion</div>
                  <div className="fw-semibold">
                    {new Date(investigation.targetCompletionDate).toLocaleDateString()}
                  </div>
                </div>
              </CCol>
              <CCol md={3}>
                <div>
                  <div className="small text-medium-emphasis">Progress</div>
                  <div className="d-flex align-items-center">
                    <CProgress 
                      value={investigation.progressPercentage} 
                      color={getProgressColor(investigation.progressPercentage)}
                      className="flex-grow-1 me-2"
                    />
                    <span className="fw-semibold">{investigation.progressPercentage}%</span>
                  </div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Investigation Tabs */}
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilClipboard} className="me-2" />
                  Overview
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'team'}
                  onClick={() => setActiveTab('team')}
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilPeople} className="me-2" />
                  Investigation Team
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'evidence'}
                  onClick={() => setActiveTab('evidence')}
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilFile} className="me-2" />
                  Evidence & Findings
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'rca'}
                  onClick={() => setActiveTab('rca')}
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilSearch} className="me-2" />
                  Root Cause Analysis
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'actions'}
                  onClick={() => setActiveTab('actions')}
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilTask} className="me-2" />
                  Actions & Recommendations
                </CNavLink>
              </CNavItem>
            </CNav>
              
              <CTabContent>
                {/* Overview Tab */}
                <CTabPane visible={activeTab === 'overview'}>
                  <CRow>
                    <CCol md={6}>
                      <CCard className="h-100">
                        <CCardHeader>
                          <strong>Investigation Timeline</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <CIcon icon={cilCalendar} className="text-white" size="sm" />
                              </div>
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold">Investigation Started</div>
                              <div className="text-medium-emphasis small">
                                {new Date(investigation.startDate).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                              <div className={`bg-${getProgressColor(investigation.progressPercentage)} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '32px', height: '32px' }}>
                                <CIcon icon={cilClock} className="text-white" size="sm" />
                              </div>
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold">Current Progress</div>
                              <div className="text-medium-emphasis small">
                                {investigation.progressPercentage}% completed
                              </div>
                            </div>
                          </div>
                          
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <CIcon icon={cilCheckCircle} className="text-white" size="sm" />
                              </div>
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold">Target Completion</div>
                              <div className="text-medium-emphasis small">
                                {new Date(investigation.targetCompletionDate).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    
                    <CCol md={6}>
                      <CCard className="h-100">
                        <CCardHeader>
                          <strong>Investigation Summary</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div className="mb-3">
                            <div className="small text-medium-emphasis">Methodology</div>
                            <CBadge color="info" className="px-2 py-1">
                              {investigation.methodology}
                            </CBadge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="small text-medium-emphasis">Team Size</div>
                            <div className="fw-semibold">{investigation.teamMembers.length} members</div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="small text-medium-emphasis">Root Causes Identified</div>
                            <div className="fw-semibold">{investigation.rootCauses.length}</div>
                          </div>
                          
                          <div>
                            <div className="small text-medium-emphasis">Contributing Factors</div>
                            <div className="fw-semibold">{investigation.contributingFactors.length}</div>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Team Tab */}
                <CTabPane visible={activeTab === 'team'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Investigation Team</h5>
                    <CButton 
                      color="primary" 
                      size="sm" 
                      onClick={() => setShowAddTeamMember(true)}
                    >
                      <CIcon icon={cilPlus} className="me-2" />
                      Add Team Member
                    </CButton>
                  </div>
                  
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Role</CTableHeaderCell>
                        <CTableHeaderCell>Department</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {investigation.teamMembers.map((member, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CIcon icon={cilUser} className="me-2" />
                              {member.name}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="secondary">{member.role}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{member.department}</CTableDataCell>
                          <CTableDataCell>{member.email}</CTableDataCell>
                          <CTableDataCell>
                            <CButton color="danger" variant="ghost" size="sm">
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CTabPane>

                {/* Evidence Tab */}
                <CTabPane visible={activeTab === 'evidence'}>
                  <CAccordion flush>
                    <CAccordionItem itemKey="initial">
                      <CAccordionHeader>Initial Findings</CAccordionHeader>
                      <CAccordionBody>
                        <CFormTextarea
                          rows={4}
                          value={investigation.initialFindings}
                          onChange={(e) => setInvestigation({
                            ...investigation,
                            initialFindings: e.target.value
                          })}
                          placeholder="Document initial observations and findings..."
                        />
                      </CAccordionBody>
                    </CAccordionItem>
                    
                    <CAccordionItem itemKey="interviews">
                      <CAccordionHeader>Interview Notes</CAccordionHeader>
                      <CAccordionBody>
                        <CFormTextarea
                          rows={6}
                          value={investigation.interviewNotes}
                          onChange={(e) => setInvestigation({
                            ...investigation,
                            interviewNotes: e.target.value
                          })}
                          placeholder="Record interview notes with witnesses, staff, and other relevant parties..."
                        />
                      </CAccordionBody>
                    </CAccordionItem>
                    
                    <CAccordionItem itemKey="evidence">
                      <CAccordionHeader>Physical Evidence</CAccordionHeader>
                      <CAccordionBody>
                        <CFormTextarea
                          rows={4}
                          value={investigation.evidenceCollected}
                          onChange={(e) => setInvestigation({
                            ...investigation,
                            evidenceCollected: e.target.value
                          })}
                          placeholder="Document physical evidence collected, photos, videos, documents..."
                        />
                        <div className="mt-3">
                          <CButton color="secondary" variant="outline" size="sm" className="me-2">
                            <CIcon icon={cilCamera} className="me-1" />
                            Upload Photos
                          </CButton>
                          <CButton color="secondary" variant="outline" size="sm">
                            <CIcon icon={cilFile} className="me-1" />
                            Upload Documents
                          </CButton>
                        </div>
                      </CAccordionBody>
                    </CAccordionItem>
                    
                    <CAccordionItem itemKey="witnesses">
                      <CAccordionHeader>Witness Statements</CAccordionHeader>
                      <CAccordionBody>
                        <CFormTextarea
                          rows={6}
                          value={investigation.witnessStatements}
                          onChange={(e) => setInvestigation({
                            ...investigation,
                            witnessStatements: e.target.value
                          })}
                          placeholder="Record detailed witness statements and testimonies..."
                        />
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                </CTabPane>

                {/* RCA Tab */}
                <CTabPane visible={activeTab === 'rca'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Root Cause Analysis</h5>
                    <CButton 
                      color="info" 
                      size="sm" 
                      onClick={() => setShowRCAModal(true)}
                    >
                      <CIcon icon={cilBullhorn} className="me-2" />
                      RCA Assistant
                    </CButton>
                  </div>
                  
                  <CRow>
                    <CCol md={6}>
                      <CCard className="mb-3">
                        <CCardHeader>
                          <strong>Root Causes</strong>
                        </CCardHeader>
                        <CCardBody>
                          <CListGroup flush>
                            {investigation.rootCauses.map((cause, index) => (
                              <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                                {cause}
                                <CButton color="danger" variant="ghost" size="sm">
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CListGroupItem>
                            ))}
                          </CListGroup>
                          <div className="mt-3">
                            <CFormInput placeholder="Add new root cause..." />
                            <CButton color="primary" size="sm" className="mt-2">
                              <CIcon icon={cilPlus} className="me-1" />
                              Add
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    
                    <CCol md={6}>
                      <CCard className="mb-3">
                        <CCardHeader>
                          <strong>Contributing Factors</strong>
                        </CCardHeader>
                        <CCardBody>
                          <CListGroup flush>
                            {investigation.contributingFactors.map((factor, index) => (
                              <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                                {factor}
                                <CButton color="danger" variant="ghost" size="sm">
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CListGroupItem>
                            ))}
                          </CListGroup>
                          <div className="mt-3">
                            <CFormInput placeholder="Add contributing factor..." />
                            <CButton color="primary" size="sm" className="mt-2">
                              <CIcon icon={cilPlus} className="me-1" />
                              Add
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  
                  <CCard>
                    <CCardHeader>
                      <strong>Systemic Issues</strong>
                    </CCardHeader>
                    <CCardBody>
                      <CFormTextarea
                        rows={4}
                        value={investigation.systemicIssues}
                        onChange={(e) => setInvestigation({
                          ...investigation,
                          systemicIssues: e.target.value
                        })}
                        placeholder="Describe any systemic or organizational issues that contributed to the incident..."
                      />
                    </CCardBody>
                  </CCard>
                </CTabPane>

                {/* Actions Tab */}
                <CTabPane visible={activeTab === 'actions'}>
                  <CRow>
                    <CCol md={6}>
                      <CCard className="mb-3">
                        <CCardHeader>
                          <strong>Immediate Actions</strong>
                        </CCardHeader>
                        <CCardBody>
                          <CFormTextarea
                            rows={4}
                            value={investigation.immediateActions}
                            onChange={(e) => setInvestigation({
                              ...investigation,
                              immediateActions: e.target.value
                            })}
                            placeholder="Actions taken immediately after the incident..."
                          />
                        </CCardBody>
                      </CCard>
                      
                      <CCard>
                        <CCardHeader>
                          <strong>Short-term Actions (1-30 days)</strong>
                        </CCardHeader>
                        <CCardBody>
                          <CFormTextarea
                            rows={4}
                            value={investigation.shortTermActions}
                            onChange={(e) => setInvestigation({
                              ...investigation,
                              shortTermActions: e.target.value
                            })}
                            placeholder="Actions to be implemented within 30 days..."
                          />
                        </CCardBody>
                      </CCard>
                    </CCol>
                    
                    <CCol md={6}>
                      <CCard className="mb-3">
                        <CCardHeader>
                          <strong>Long-term Actions (30+ days)</strong>
                        </CCardHeader>
                        <CCardBody>
                          <CFormTextarea
                            rows={4}
                            value={investigation.longTermActions}
                            onChange={(e) => setInvestigation({
                              ...investigation,
                              longTermActions: e.target.value
                            })}
                            placeholder="Strategic actions for long-term improvement..."
                          />
                        </CCardBody>
                      </CCard>
                      
                      <CCard>
                        <CCardHeader>
                          <strong>Preventive Measures</strong>
                        </CCardHeader>
                        <CCardBody>
                          <CFormTextarea
                            rows={4}
                            value={investigation.preventiveMeasures}
                            onChange={(e) => setInvestigation({
                              ...investigation,
                              preventiveMeasures: e.target.value
                            })}
                            placeholder="Measures to prevent similar incidents in the future..."
                          />
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  
                  {investigation.status !== 'Completed' && (
                    <div className="text-end mt-4">
                      <CButton 
                        color="success" 
                        size="lg"
                        onClick={handleCompleteInvestigation}
                        disabled={saving || investigation.progressPercentage < 80}
                      >
                        {saving ? (
                          <>
                            <CSpinner size="sm" className="me-2" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            Complete Investigation
                          </>
                        )}
                      </CButton>
                    </div>
                  )}
                </CTabPane>
              </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Add Team Member Modal */}
      <CModal visible={showAddTeamMember} onClose={() => setShowAddTeamMember(false)}>
        <CModalHeader>
          <CModalTitle>Add Team Member</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Name</CFormLabel>
              <CFormInput
                value={newTeamMember.name}
                onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Role</CFormLabel>
              <CFormSelect
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
              >
                <option value="">Select role...</option>
                <option value="Investigator">Investigator</option>
                <option value="Technical Expert">Technical Expert</option>
                <option value="Witness">Witness</option>
                <option value="Medical Expert">Medical Expert</option>
                <option value="Safety Officer">Safety Officer</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Department</CFormLabel>
              <CFormInput
                value={newTeamMember.department}
                onChange={(e) => setNewTeamMember({...newTeamMember, department: e.target.value})}
                placeholder="Enter department"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                type="email"
                value={newTeamMember.email}
                onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddTeamMember(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddTeamMember}>
            Add Member
          </CButton>
        </CModalFooter>
      </CModal>

      {/* RCA Assistant Modal */}
      <CModal size="lg" visible={showRCAModal} onClose={() => setShowRCAModal(false)}>
        <CModalHeader>
          <CModalTitle>Root Cause Analysis Assistant</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-medium-emphasis mb-3">
            Choose an RCA methodology to guide your analysis process.
          </p>
          <CRow>
            {rcaMethods.map((method, index) => (
              <CCol md={6} key={index} className="mb-3">
                <CCard className="h-100 cursor-pointer" onClick={() => {
                  setInvestigation({
                    ...investigation,
                    methodology: method.name
                  })
                  setShowRCAModal(false)
                }}>
                  <CCardBody>
                    <h6>{method.name}</h6>
                    <p className="text-medium-emphasis small">{method.description}</p>
                    <div className="mt-2">
                      <CBadge color="info">Template Available</CBadge>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowRCAModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default IncidentInvestigation