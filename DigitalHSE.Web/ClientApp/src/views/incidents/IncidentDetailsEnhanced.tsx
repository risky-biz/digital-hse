import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
  CButton,
  CButtonGroup,
  CCallout,
  CAlert,
  CSpinner,
  CListGroup,
  CListGroupItem,
  CProgress,
  CProgressBar,
  CWidgetStatsF,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CFormCheck,
  CTooltip,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CImage,
  CCarousel,
  CCarouselItem,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
} from '@coreui/react';
import {
  cilWarning,
  cilCheckCircle,
  cilClock,
  cilUser,
  cilLocationPin,
  cilCalendar,
  cilPhone,
  cilEnvelopeLetter,
  cilMedicalCross,
  cilCamera,
  cilFile,
  cilPeople,
  cilSchool,
  cilPencil,
  cilMagnifyingGlass,
  cilTask,
  cilNotes,
  cilPrint,
  cilCloudDownload,
  cilArrowRight,
  cilBan,
  cilSend,
  cilReload,
  cilShieldAlt,
  cilChartLine,
  cilChatBubble,
  cilHistory,
  cilInfo,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays, differenceInHours } from 'date-fns';
import { toast } from 'react-toastify';
import { incidentApi } from '../../services/incidentApi';

// Types
interface IncidentDetail {
  id: string;
  incidentNumber: string;
  incidentDateTime: string;
  reportedDateTime: string;
  title: string;
  description: string;
  category: string;
  categoryDisplay: string;
  type: string;
  typeDisplay: string;
  severity: number;
  severityDisplay: string;
  urgency: number;
  urgencyDisplay: string;
  status: string;
  statusDisplay: string;
  isAnonymous: boolean;
  anonymousTrackingCode?: string;
  
  // Location details
  location: string;
  building: string;
  floor: string;
  room?: string;
  department: string;
  specificLocation?: string;
  latitude?: number;
  longitude?: number;
  qrCodeLocation?: string;
  
  // Reporter information
  reportedBy: string;
  reporterEmail: string;
  reporterPhone?: string;
  reporterType: string;
  reporterTypeDisplay: string;
  reporterDepartment?: string;
  
  // Person affected
  personAffectedType?: string;
  personAffectedTypeDisplay?: string;
  personAffectedName?: string;
  personAffectedId?: string;
  personAffectedDepartment?: string;
  personAffectedClass?: string;
  personAffectedAge?: number;
  personAffectedContact?: string;
  
  // Investigation details
  investigationStatus: string;
  investigationStatusDisplay: string;
  investigatedBy?: string;
  investigationStartDate?: string;
  investigationDueDate?: string;
  investigationCompletedDate?: string;
  rootCauseAnalysis?: string;
  contributingFactors?: string;
  lessonsLearned?: string;
  requiresCAPAActions: boolean;
  
  // Parent/Guardian info (for students)
  parentGuardianName?: string;
  parentGuardianContact?: string;
  parentGuardianEmail?: string;
  parentNotified: boolean;
  parentNotificationTime?: string;
  parentNotificationMethod?: string;
  parentPreferredLanguage?: string;
  parentAcknowledgment: boolean;
  parentAcknowledgmentTime?: string;
  
  // Medical attention
  requiresMedicalAttention: boolean;
  firstAidProvided?: string;
  emergencyServicesNotified: boolean;
  emergencyServiceType?: string;
  hospitalName?: string;
  medicalTreatmentDetails?: string;
  medicalFollowUpRequired: boolean;
  
  // Regulatory compliance
  requiresBPJSReporting: boolean;
  bpjsReferenceNumber?: string;
  bpjsReportedDate?: string;
  requiresMinistryReporting: boolean;
  ministryReferenceNumber?: string;
  ministryReportedDate?: string;
  regulatoryDeadline?: string;
  regulatoryDeadlineMet: boolean;
  
  // Evidence
  photoUrls: string[];
  videoUrls: string[];
  documentUrls: string[];
  cctvFootageUrls: string[];
  
  // Witnesses
  witnessNames: string[];
  witnessContacts: string[];
  witnessStatements: string[];
  
  // School context
  academicYear?: string;
  term?: string;
  activityType?: string;
  subjectClass?: string;
  teacherInCharge?: string;
  supervisorPresent?: string;
  studentsPresent?: number;
  weatherConditions?: string;
  lightingConditions?: string;
  
  // Immediate response
  immediateActions?: string;
  evacuationRequired: boolean;
  areaSecured: boolean;
  
  // Insurance & legal
  insuranceClaimNumber?: string;
  estimatedCost?: number;
  actualCost?: number;
  legalCaseNumber?: string;
  legalStatus?: string;
  
  // Timestamps and metadata
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  version: number;
  
  // Related data
  capaActions: CAPAAction[];
  notifications: NotificationRecord[];
  timeline: TimelineEvent[];
  comments: Comment[];
  
  // Computed properties
  isStudentIncident: boolean;
  isRegulatoryOverdue: boolean;
}

interface CAPAAction {
  id: string;
  actionNumber: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  completedDate?: string;
  effectiveness?: string;
}

interface NotificationRecord {
  id: string;
  recipient: string;
  type: string;
  sentAt: string;
  status: string;
  method: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  type: string;
}

interface Comment {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  isInternal: boolean;
}

const IncidentDetailsEnhanced: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showTimelineOffcanvas, setShowTimelineOffcanvas] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [notificationRecipient, setNotificationRecipient] = useState('parent');
  const [investigationNotes, setInvestigationNotes] = useState('');

  // Load incident details
  const loadIncident = async () => {
    setLoading(true);
    try {
      const response = await incidentApi.get(`/api/incident/${id}`);
      if (response.success) {
        setIncident(response.data);
      } else {
        toast.error(t('incident.errors.loadingDetails'));
        navigate('/incidents');
      }
    } catch (error) {
      console.error('Failed to load incident:', error);
      toast.error(t('incident.errors.loadingDetails'));
      navigate('/incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadIncident();
    }
  }, [id]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadIncident();
    setRefreshing(false);
    toast.success(t('common.refreshed'));
  };

  // Start investigation
  const handleStartInvestigation = async () => {
    try {
      const response = await incidentApi.post(`/api/incident/${id}/investigate`, {
        investigator: 'Current User', // Would come from auth context
        notes: investigationNotes,
      });
      if (response.success) {
        toast.success(t('incident.investigation.started'));
        setShowInvestigationModal(false);
        loadIncident();
      } else {
        toast.error(response.message || t('incident.investigation.startError'));
      }
    } catch (error) {
      toast.error(t('incident.investigation.startError'));
    }
  };

  // Send notification
  const handleSendNotification = async () => {
    try {
      const response = await incidentApi.post(`/api/incident/${id}/notify-parent`, {
        method: 'email',
        urgency: incident?.urgency || 'Medium',
      });
      if (response.success) {
        toast.success(t('incident.notification.sent'));
        setShowNotificationModal(false);
        loadIncident();
      } else {
        toast.error(response.message || t('incident.notification.error'));
      }
    } catch (error) {
      toast.error(t('incident.notification.error'));
    }
  };

  // Add comment
  const handleAddComment = async () => {
    try {
      const response = await incidentApi.post(`/api/incident/${id}/comment`, {
        content: commentText,
        isInternal: true,
      });
      if (response.success) {
        toast.success(t('incident.comment.added'));
        setShowCommentModal(false);
        setCommentText('');
        loadIncident();
      } else {
        toast.error(response.message || t('incident.comment.error'));
      }
    } catch (error) {
      toast.error(t('incident.comment.error'));
    }
  };

  if (loading || !incident) {
    return (
      <CContainer fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </CContainer>
    );
  }

  // Calculate metrics
  const daysSinceIncident = differenceInDays(new Date(), parseISO(incident.incidentDateTime));
  const hoursToRespond = incident.reportedDateTime 
    ? differenceInHours(parseISO(incident.reportedDateTime), parseISO(incident.incidentDateTime))
    : 0;
  const investigationProgress = incident.investigationStatus === 'Completed' ? 100 
    : incident.investigationStatus === 'InProgress' ? 50 
    : 0;

  // Get status colors
  const getSeverityColor = (severity: number): string => {
    switch (severity) {
      case 5: return 'danger';
      case 4: return 'warning';
      case 3: return 'info';
      case 2: return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Closed': return 'success';
      case 'Resolved': return 'info';
      case 'InProgress': return 'primary';
      case 'Acknowledged': return 'warning';
      default: return 'secondary';
    }
  };

  // Render header actions
  const renderHeaderActions = () => (
    <div className="d-flex gap-2">
      <CButton
        color="secondary"
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={refreshing}
      >
        {refreshing ? <CSpinner size="sm" /> : <CIcon icon={cilReload} />}
      </CButton>
      <CDropdown>
        <CDropdownToggle color="primary" size="sm">
          <CIcon icon={cilTask} className="me-2" />
          {t('incident.actions.title')}
        </CDropdownToggle>
        <CDropdownMenu>
          {incident.investigationStatus === 'NotStarted' && (
            <CDropdownItem onClick={() => setShowInvestigationModal(true)}>
              <CIcon icon={cilMagnifyingGlass} className="me-2" />
              {t('incident.actions.startInvestigation')}
            </CDropdownItem>
          )}
          {incident.isStudentIncident && !incident.parentNotified && (
            <CDropdownItem onClick={() => setShowNotificationModal(true)}>
              <CIcon icon={cilSend} className="me-2" />
              {t('incident.actions.notifyParent')}
            </CDropdownItem>
          )}
          <CDropdownItem onClick={() => navigate(`/incidents/${id}/edit`)}>
            <CIcon icon={cilPencil} className="me-2" />
            {t('incident.actions.edit')}
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={() => window.print()}>
            <CIcon icon={cilPrint} className="me-2" />
            {t('incident.actions.print')}
          </CDropdownItem>
          <CDropdownItem>
            <CIcon icon={cilCloudDownload} className="me-2" />
            {t('incident.actions.export')}
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      <CButton
        color="info"
        variant="ghost"
        size="sm"
        onClick={() => setShowTimelineOffcanvas(true)}
      >
        <CIcon icon={cilHistory} className="me-2" />
        {t('incident.timeline.title')}
      </CButton>
    </div>
  );

  // Render overview tab
  const renderOverviewTab = () => (
    <div>
      {/* Key Metrics */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            color={getSeverityColor(incident.severity)}
            icon={<CIcon icon={cilWarning} height={24} />}
            title={t('incident.fields.severity')}
            value={incident.severityDisplay}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            color={getStatusColor(incident.status)}
            icon={<CIcon icon={cilCheckCircle} height={24} />}
            title={t('incident.fields.status')}
            value={incident.statusDisplay}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            color="info"
            icon={<CIcon icon={cilClock} height={24} />}
            title={t('incident.metrics.age')}
            value={`${daysSinceIncident} ${t('common.days')}`}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilMagnifyingGlass} height={24} />}
            title={t('incident.investigation.progress')}
            value={`${investigationProgress}%`}
          />
        </CCol>
      </CRow>

      {/* Alerts */}
      {incident.isRegulatoryOverdue && (
        <CAlert color="danger" className="mb-4">
          <CIcon icon={cilWarning} className="me-2" />
          <strong>{t('incident.alerts.regulatoryOverdue')}</strong>
          {incident.regulatoryDeadline && (
            <span className="ms-2">
              - {t('incident.alerts.deadline')}: {format(parseISO(incident.regulatoryDeadline), 'dd/MM/yyyy')}
            </span>
          )}
        </CAlert>
      )}

      {incident.isStudentIncident && !incident.parentNotified && (
        <CAlert color="warning" className="mb-4">
          <CIcon icon={cilPeople} className="me-2" />
          <strong>{t('incident.alerts.parentNotRequired')}</strong>
          <CButton
            color="warning"
            variant="outline"
            size="sm"
            className="ms-3"
            onClick={() => setShowNotificationModal(true)}
          >
            {t('incident.actions.notifyNow')}
          </CButton>
        </CAlert>
      )}

      {/* Basic Information */}
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">{t('incident.sections.basicInfo')}</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{t('incident.fields.number')}</div>
                    {incident.incidentNumber}
                    {incident.isAnonymous && (
                      <CBadge color="secondary" className="ms-2">Anonymous</CBadge>
                    )}
                  </div>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{t('incident.fields.dateTime')}</div>
                    {format(parseISO(incident.incidentDateTime), 'dd/MM/yyyy HH:mm')}
                    <small className="text-muted ms-2">
                      ({daysSinceIncident} {t('incident.metrics.daysAgo')})
                    </small>
                  </div>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{t('incident.fields.category')}</div>
                    {incident.categoryDisplay}
                  </div>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{t('incident.fields.type')}</div>
                    {incident.typeDisplay}
                  </div>
                </CListGroupItem>
              </CListGroup>
            </CCol>
            <CCol md={6}>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{t('incident.fields.reportedBy')}</div>
                    {incident.reportedBy} ({incident.reporterTypeDisplay})
                    {incident.reporterEmail && (
                      <div className="small text-muted">
                        <CIcon icon={cilEnvelopeLetter} size="sm" className="me-1" />
                        {incident.reporterEmail}
                      </div>
                    )}
                    {incident.reporterPhone && (
                      <div className="small text-muted">
                        <CIcon icon={cilPhone} size="sm" className="me-1" />
                        {incident.reporterPhone}
                      </div>
                    )}
                  </div>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{t('incident.fields.reportedAt')}</div>
                    {format(parseISO(incident.reportedDateTime), 'dd/MM/yyyy HH:mm')}
                    <small className="text-muted ms-2">
                      ({hoursToRespond} {t('incident.metrics.hoursToReport')})
                    </small>
                  </div>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{t('incident.fields.urgency')}</div>
                    <CBadge color={incident.urgency >= 4 ? 'danger' : incident.urgency >= 3 ? 'warning' : 'info'}>
                      {incident.urgencyDisplay}
                    </CBadge>
                  </div>
                </CListGroupItem>
              </CListGroup>
            </CCol>
          </CRow>

          <hr />

          <div>
            <h6 className="mb-3">{t('incident.fields.description')}</h6>
            <p className="text-break">{incident.description}</p>
          </div>
        </CCardBody>
      </CCard>

      {/* Location Information */}
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilLocationPin} className="me-2" />
            {t('incident.sections.location')}
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>{t('incident.fields.building')}:</strong> {incident.building}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>{t('incident.fields.floor')}:</strong> {incident.floor}
                </CListGroupItem>
                {incident.room && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.room')}:</strong> {incident.room}
                  </CListGroupItem>
                )}
                <CListGroupItem>
                  <strong>{t('incident.fields.location')}:</strong> {incident.location}
                </CListGroupItem>
              </CListGroup>
            </CCol>
            <CCol md={6}>
              {incident.specificLocation && (
                <CListGroupItem>
                  <strong>{t('incident.fields.specificLocation')}:</strong>
                  <p className="mb-0 mt-1">{incident.specificLocation}</p>
                </CListGroupItem>
              )}
              {incident.latitude && incident.longitude && (
                <CListGroupItem>
                  <strong>{t('incident.fields.gpsCoordinates')}:</strong>
                  <div className="mt-1">
                    <CBadge color="info">
                      {incident.latitude.toFixed(6)}, {incident.longitude.toFixed(6)}
                    </CBadge>
                    <CButton
                      color="primary"
                      variant="ghost"
                      size="sm"
                      className="ms-2"
                      onClick={() => window.open(`https://maps.google.com/?q=${incident.latitude},${incident.longitude}`, '_blank')}
                    >
                      <CIcon icon={cilLocationPin} className="me-1" />
                      {t('incident.actions.viewOnMap')}
                    </CButton>
                  </div>
                </CListGroupItem>
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );

  // Render people tab
  const renderPeopleTab = () => (
    <div>
      {/* Person Affected */}
      {incident.personAffectedName && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilUser} className="me-2" />
              {t('incident.sections.personAffected')}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <CListGroup flush>
                  <CListGroupItem>
                    <strong>{t('incident.fields.name')}:</strong> {incident.personAffectedName}
                  </CListGroupItem>
                  <CListGroupItem>
                    <strong>{t('incident.fields.type')}:</strong> {incident.personAffectedTypeDisplay}
                  </CListGroupItem>
                  {incident.personAffectedId && (
                    <CListGroupItem>
                      <strong>{t('incident.fields.id')}:</strong> {incident.personAffectedId}
                    </CListGroupItem>
                  )}
                  {incident.personAffectedDepartment && (
                    <CListGroupItem>
                      <strong>{t('incident.fields.department')}:</strong> {incident.personAffectedDepartment}
                    </CListGroupItem>
                  )}
                </CListGroup>
              </CCol>
              <CCol md={6}>
                {incident.personAffectedClass && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.class')}:</strong> {incident.personAffectedClass}
                  </CListGroupItem>
                )}
                {incident.personAffectedAge && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.age')}:</strong> {incident.personAffectedAge} years
                  </CListGroupItem>
                )}
                {incident.personAffectedContact && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.contact')}:</strong> {incident.personAffectedContact}
                  </CListGroupItem>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* Parent/Guardian Information */}
      {incident.parentGuardianName && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilPeople} className="me-2" />
              {t('incident.sections.parentInfo')}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <CListGroup flush>
                  <CListGroupItem>
                    <strong>{t('incident.fields.parentName')}:</strong> {incident.parentGuardianName}
                  </CListGroupItem>
                  <CListGroupItem>
                    <strong>{t('incident.fields.parentContact')}:</strong> {incident.parentGuardianContact}
                  </CListGroupItem>
                  {incident.parentGuardianEmail && (
                    <CListGroupItem>
                      <strong>{t('incident.fields.parentEmail')}:</strong> {incident.parentGuardianEmail}
                    </CListGroupItem>
                  )}
                </CListGroup>
              </CCol>
              <CCol md={6}>
                <CListGroup flush>
                  <CListGroupItem>
                    <strong>{t('incident.fields.notificationStatus')}:</strong>
                    {incident.parentNotified ? (
                      <CBadge color="success" className="ms-2">
                        <CIcon icon={cilCheckCircle} size="sm" className="me-1" />
                        {t('incident.parent.notified')}
                      </CBadge>
                    ) : (
                      <CBadge color="warning" className="ms-2">
                        <CIcon icon={cilClock} size="sm" className="me-1" />
                        {t('incident.parent.pending')}
                      </CBadge>
                    )}
                  </CListGroupItem>
                  {incident.parentNotificationTime && (
                    <CListGroupItem>
                      <strong>{t('incident.fields.notifiedAt')}:</strong>{' '}
                      {format(parseISO(incident.parentNotificationTime), 'dd/MM/yyyy HH:mm')}
                    </CListGroupItem>
                  )}
                  {incident.parentAcknowledgment && (
                    <CListGroupItem>
                      <strong>{t('incident.fields.acknowledged')}:</strong>{' '}
                      <CBadge color="success">
                        {format(parseISO(incident.parentAcknowledgmentTime!), 'dd/MM/yyyy HH:mm')}
                      </CBadge>
                    </CListGroupItem>
                  )}
                </CListGroup>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* Witnesses */}
      {incident.witnessNames && incident.witnessNames.length > 0 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilPeople} className="me-2" />
              {t('incident.sections.witnesses')}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>{t('incident.fields.name')}</CTableHeaderCell>
                  <CTableHeaderCell>{t('incident.fields.contact')}</CTableHeaderCell>
                  <CTableHeaderCell>{t('incident.fields.statement')}</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {incident.witnessNames.map((name, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{name}</CTableDataCell>
                    <CTableDataCell>{incident.witnessContacts[index] || '-'}</CTableDataCell>
                    <CTableDataCell>
                      {incident.witnessStatements[index] ? (
                        <CBadge color="success">{t('incident.witness.provided')}</CBadge>
                      ) : (
                        <CBadge color="secondary">{t('incident.witness.pending')}</CBadge>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      )}
    </div>
  );

  // Render medical tab
  const renderMedicalTab = () => (
    <div>
      {/* Medical Response */}
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilMedicalCross} className="me-2" />
            {t('incident.sections.medicalResponse')}
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>{t('incident.fields.requiresMedical')}:</strong>
                  {incident.requiresMedicalAttention ? (
                    <CBadge color="danger" className="ms-2">Yes</CBadge>
                  ) : (
                    <CBadge color="success" className="ms-2">No</CBadge>
                  )}
                </CListGroupItem>
                {incident.firstAidProvided && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.firstAid')}:</strong>
                    <p className="mb-0 mt-1">{incident.firstAidProvided}</p>
                  </CListGroupItem>
                )}
                <CListGroupItem>
                  <strong>{t('incident.fields.emergencyServices')}:</strong>
                  {incident.emergencyServicesNotified ? (
                    <span>
                      <CBadge color="warning" className="ms-2">Notified</CBadge>
                      {incident.emergencyServiceType && (
                        <span className="ms-2">- {incident.emergencyServiceType}</span>
                      )}
                    </span>
                  ) : (
                    <CBadge color="secondary" className="ms-2">Not Required</CBadge>
                  )}
                </CListGroupItem>
              </CListGroup>
            </CCol>
            <CCol md={6}>
              {incident.hospitalName && (
                <CListGroupItem>
                  <strong>{t('incident.fields.hospital')}:</strong> {incident.hospitalName}
                </CListGroupItem>
              )}
              {incident.medicalTreatmentDetails && (
                <CListGroupItem>
                  <strong>{t('incident.fields.treatment')}:</strong>
                  <p className="mb-0 mt-1">{incident.medicalTreatmentDetails}</p>
                </CListGroupItem>
              )}
              <CListGroupItem>
                <strong>{t('incident.fields.followUpRequired')}:</strong>
                {incident.medicalFollowUpRequired ? (
                  <CBadge color="warning" className="ms-2">Yes</CBadge>
                ) : (
                  <CBadge color="success" className="ms-2">No</CBadge>
                )}
              </CListGroupItem>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Immediate Actions */}
      {incident.immediateActions && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">{t('incident.sections.immediateActions')}</h5>
          </CCardHeader>
          <CCardBody>
            <p className="mb-3">{incident.immediateActions}</p>
            <CRow>
              <CCol md={6}>
                <CListGroupItem>
                  <strong>{t('incident.fields.evacuationRequired')}:</strong>
                  {incident.evacuationRequired ? (
                    <CBadge color="danger" className="ms-2">Yes</CBadge>
                  ) : (
                    <CBadge color="success" className="ms-2">No</CBadge>
                  )}
                </CListGroupItem>
              </CCol>
              <CCol md={6}>
                <CListGroupItem>
                  <strong>{t('incident.fields.areaSecured')}:</strong>
                  {incident.areaSecured ? (
                    <CBadge color="success" className="ms-2">Yes</CBadge>
                  ) : (
                    <CBadge color="warning" className="ms-2">No</CBadge>
                  )}
                </CListGroupItem>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* School Context */}
      {incident.activityType && (
        <CCard>
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilSchool} className="me-2" />
              {t('incident.sections.schoolContext')}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <CListGroup flush>
                  <CListGroupItem>
                    <strong>{t('incident.fields.activityType')}:</strong> {incident.activityType}
                  </CListGroupItem>
                  {incident.subjectClass && (
                    <CListGroupItem>
                      <strong>{t('incident.fields.subject')}:</strong> {incident.subjectClass}
                    </CListGroupItem>
                  )}
                  {incident.teacherInCharge && (
                    <CListGroupItem>
                      <strong>{t('incident.fields.teacher')}:</strong> {incident.teacherInCharge}
                    </CListGroupItem>
                  )}
                </CListGroup>
              </CCol>
              <CCol md={6}>
                {incident.supervisorPresent && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.supervisor')}:</strong> {incident.supervisorPresent}
                  </CListGroupItem>
                )}
                {incident.studentsPresent !== undefined && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.studentsPresent')}:</strong> {incident.studentsPresent}
                  </CListGroupItem>
                )}
                <CListGroupItem>
                  <strong>{t('incident.fields.conditions')}:</strong>
                  {incident.weatherConditions && (
                    <CBadge color="info" className="ms-2">{incident.weatherConditions}</CBadge>
                  )}
                  {incident.lightingConditions && (
                    <CBadge color="info" className="ms-2">{incident.lightingConditions}</CBadge>
                  )}
                </CListGroupItem>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}
    </div>
  );

  // Render investigation tab
  const renderInvestigationTab = () => (
    <div>
      {/* Investigation Status */}
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilMagnifyingGlass} className="me-2" />
            {t('incident.sections.investigationStatus')}
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol>
              <CProgress height={20}>
                <CProgressBar
                  value={investigationProgress}
                  color={investigationProgress === 100 ? 'success' : investigationProgress > 0 ? 'primary' : 'secondary'}
                >
                  {incident.investigationStatusDisplay} ({investigationProgress}%)
                </CProgressBar>
              </CProgress>
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6}>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>{t('incident.fields.status')}:</strong>
                  <CBadge
                    color={incident.investigationStatus === 'Completed' ? 'success' : incident.investigationStatus === 'InProgress' ? 'primary' : 'secondary'}
                    className="ms-2"
                  >
                    {incident.investigationStatusDisplay}
                  </CBadge>
                </CListGroupItem>
                {incident.investigatedBy && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.investigator')}:</strong> {incident.investigatedBy}
                  </CListGroupItem>
                )}
                {incident.investigationStartDate && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.startDate')}:</strong>{' '}
                    {format(parseISO(incident.investigationStartDate), 'dd/MM/yyyy')}
                  </CListGroupItem>
                )}
              </CListGroup>
            </CCol>
            <CCol md={6}>
              {incident.investigationDueDate && (
                <CListGroupItem>
                  <strong>{t('incident.fields.dueDate')}:</strong>{' '}
                  {format(parseISO(incident.investigationDueDate), 'dd/MM/yyyy')}
                  {new Date(incident.investigationDueDate) < new Date() && incident.investigationStatus !== 'Completed' && (
                    <CBadge color="danger" className="ms-2">Overdue</CBadge>
                  )}
                </CListGroupItem>
              )}
              {incident.investigationCompletedDate && (
                <CListGroupItem>
                  <strong>{t('incident.fields.completedDate')}:</strong>{' '}
                  {format(parseISO(incident.investigationCompletedDate), 'dd/MM/yyyy')}
                </CListGroupItem>
              )}
              <CListGroupItem>
                <strong>{t('incident.fields.requiresCAPAActions')}:</strong>
                {incident.requiresCAPAActions ? (
                  <CBadge color="warning" className="ms-2">Yes</CBadge>
                ) : (
                  <CBadge color="success" className="ms-2">No</CBadge>
                )}
              </CListGroupItem>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Root Cause Analysis */}
      {incident.rootCauseAnalysis && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">{t('incident.sections.rootCauseAnalysis')}</h5>
          </CCardHeader>
          <CCardBody>
            <CAccordion>
              <CAccordionItem>
                <CAccordionHeader>{t('incident.fields.rootCause')}</CAccordionHeader>
                <CAccordionBody>
                  {incident.rootCauseAnalysis}
                </CAccordionBody>
              </CAccordionItem>
              {incident.contributingFactors && (
                <CAccordionItem>
                  <CAccordionHeader>{t('incident.fields.contributingFactors')}</CAccordionHeader>
                  <CAccordionBody>
                    {incident.contributingFactors}
                  </CAccordionBody>
                </CAccordionItem>
              )}
              {incident.lessonsLearned && (
                <CAccordionItem>
                  <CAccordionHeader>{t('incident.fields.lessonsLearned')}</CAccordionHeader>
                  <CAccordionBody>
                    {incident.lessonsLearned}
                  </CAccordionBody>
                </CAccordionItem>
              )}
            </CAccordion>
          </CCardBody>
        </CCard>
      )}

      {/* CAPA Actions */}
      {incident.capaActions && incident.capaActions.length > 0 && (
        <CCard>
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilTask} className="me-2" />
              {t('incident.sections.capaActions')}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>{t('incident.capa.number')}</CTableHeaderCell>
                  <CTableHeaderCell>{t('incident.capa.description')}</CTableHeaderCell>
                  <CTableHeaderCell>{t('incident.capa.assignedTo')}</CTableHeaderCell>
                  <CTableHeaderCell>{t('incident.capa.dueDate')}</CTableHeaderCell>
                  <CTableHeaderCell>{t('incident.capa.status')}</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {incident.capaActions.map((action) => (
                  <CTableRow key={action.id}>
                    <CTableDataCell>{action.actionNumber}</CTableDataCell>
                    <CTableDataCell>{action.description}</CTableDataCell>
                    <CTableDataCell>{action.assignedTo}</CTableDataCell>
                    <CTableDataCell>
                      {format(parseISO(action.dueDate), 'dd/MM/yyyy')}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={action.status === 'Completed' ? 'success' : action.status === 'InProgress' ? 'primary' : 'secondary'}
                      >
                        {action.status}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      )}
    </div>
  );

  // Render compliance tab
  const renderComplianceTab = () => (
    <div>
      {/* Regulatory Compliance */}
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilShieldAlt} className="me-2" />
            {t('incident.sections.regulatoryCompliance')}
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <h6>{t('incident.compliance.bpjs')}</h6>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>{t('incident.fields.required')}:</strong>
                  {incident.requiresBPJSReporting ? (
                    <CBadge color="warning" className="ms-2">Yes</CBadge>
                  ) : (
                    <CBadge color="secondary" className="ms-2">No</CBadge>
                  )}
                </CListGroupItem>
                {incident.bpjsReferenceNumber && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.referenceNumber')}:</strong> {incident.bpjsReferenceNumber}
                  </CListGroupItem>
                )}
                {incident.bpjsReportedDate && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.reportedDate')}:</strong>{' '}
                    {format(parseISO(incident.bpjsReportedDate), 'dd/MM/yyyy')}
                  </CListGroupItem>
                )}
              </CListGroup>
            </CCol>
            <CCol md={6}>
              <h6>{t('incident.compliance.ministry')}</h6>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>{t('incident.fields.required')}:</strong>
                  {incident.requiresMinistryReporting ? (
                    <CBadge color="warning" className="ms-2">Yes</CBadge>
                  ) : (
                    <CBadge color="secondary" className="ms-2">No</CBadge>
                  )}
                </CListGroupItem>
                {incident.ministryReferenceNumber && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.referenceNumber')}:</strong> {incident.ministryReferenceNumber}
                  </CListGroupItem>
                )}
                {incident.ministryReportedDate && (
                  <CListGroupItem>
                    <strong>{t('incident.fields.reportedDate')}:</strong>{' '}
                    {format(parseISO(incident.ministryReportedDate), 'dd/MM/yyyy')}
                  </CListGroupItem>
                )}
              </CListGroup>
            </CCol>
          </CRow>

          {incident.regulatoryDeadline && (
            <CCallout
              color={incident.regulatoryDeadlineMet ? 'success' : new Date(incident.regulatoryDeadline) > new Date() ? 'warning' : 'danger'}
              className="mt-3"
            >
              <strong>{t('incident.compliance.deadline')}:</strong>{' '}
              {format(parseISO(incident.regulatoryDeadline), 'dd/MM/yyyy HH:mm')}
              {!incident.regulatoryDeadlineMet && new Date(incident.regulatoryDeadline) < new Date() && (
                <span className="ms-2">
                  - <strong>{t('incident.compliance.overdue')}</strong>
                </span>
              )}
            </CCallout>
          )}
        </CCardBody>
      </CCard>

      {/* Insurance & Legal */}
      {(incident.insuranceClaimNumber || incident.legalCaseNumber) && (
        <CCard>
          <CCardHeader>
            <h5 className="mb-0">{t('incident.sections.insuranceLegal')}</h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {incident.insuranceClaimNumber && (
                <CCol md={6}>
                  <h6>{t('incident.insurance.title')}</h6>
                  <CListGroup flush>
                    <CListGroupItem>
                      <strong>{t('incident.fields.claimNumber')}:</strong> {incident.insuranceClaimNumber}
                    </CListGroupItem>
                    {incident.estimatedCost && (
                      <CListGroupItem>
                        <strong>{t('incident.fields.estimatedCost')}:</strong> ${incident.estimatedCost.toLocaleString()}
                      </CListGroupItem>
                    )}
                    {incident.actualCost && (
                      <CListGroupItem>
                        <strong>{t('incident.fields.actualCost')}:</strong> ${incident.actualCost.toLocaleString()}
                      </CListGroupItem>
                    )}
                  </CListGroup>
                </CCol>
              )}
              {incident.legalCaseNumber && (
                <CCol md={6}>
                  <h6>{t('incident.legal.title')}</h6>
                  <CListGroup flush>
                    <CListGroupItem>
                      <strong>{t('incident.fields.caseNumber')}:</strong> {incident.legalCaseNumber}
                    </CListGroupItem>
                    {incident.legalStatus && (
                      <CListGroupItem>
                        <strong>{t('incident.fields.status')}:</strong> {incident.legalStatus}
                      </CListGroupItem>
                    )}
                  </CListGroup>
                </CCol>
              )}
            </CRow>
          </CCardBody>
        </CCard>
      )}
    </div>
  );

  // Render evidence tab
  const renderEvidenceTab = () => (
    <div>
      {/* Photos */}
      {incident.photoUrls && incident.photoUrls.length > 0 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilCamera} className="me-2" />
              {t('incident.evidence.photos')} ({incident.photoUrls.length})
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {incident.photoUrls.map((url, index) => (
                <CCol key={index} xs={6} md={4} lg={3} className="mb-3">
                  <CImage
                    src={url}
                    alt={`Evidence photo ${index + 1}`}
                    thumbnail
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.open(url, '_blank')}
                  />
                </CCol>
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* Videos */}
      {incident.videoUrls && incident.videoUrls.length > 0 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilCamera} className="me-2" />
              {t('incident.evidence.videos')} ({incident.videoUrls.length})
            </h5>
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              {incident.videoUrls.map((url, index) => (
                <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                  <span>Video {index + 1}</span>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                  >
                    {t('common.view')}
                  </CButton>
                </CListGroupItem>
              ))}
            </CListGroup>
          </CCardBody>
        </CCard>
      )}

      {/* Documents */}
      {incident.documentUrls && incident.documentUrls.length > 0 && (
        <CCard>
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilFile} className="me-2" />
              {t('incident.evidence.documents')} ({incident.documentUrls.length})
            </h5>
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              {incident.documentUrls.map((url, index) => (
                <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                  <span>Document {index + 1}</span>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <CIcon icon={cilCloudDownload} className="me-2" />
                    {t('common.download')}
                  </CButton>
                </CListGroupItem>
              ))}
            </CListGroup>
          </CCardBody>
        </CCard>
      )}
    </div>
  );

  // Render comments section
  const renderComments = () => (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <CIcon icon={cilChatBubble} className="me-2" />
          {t('incident.sections.comments')} ({incident.comments?.length || 0})
        </h5>
        <CButton
          color="primary"
          size="sm"
          onClick={() => setShowCommentModal(true)}
        >
          <CIcon icon={cilNotes} className="me-2" />
          {t('incident.comments.add')}
        </CButton>
      </CCardHeader>
      <CCardBody>
        {incident.comments && incident.comments.length > 0 ? (
          <div className="timeline">
            {incident.comments.map((comment) => (
              <div key={comment.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{comment.author}</strong>
                      {comment.isInternal && (
                        <CBadge color="info" className="ms-2">Internal</CBadge>
                      )}
                    </div>
                    <small className="text-muted">
                      {format(parseISO(comment.timestamp), 'dd/MM/yyyy HH:mm')}
                    </small>
                  </div>
                  <p className="mb-0">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mb-0">{t('incident.comments.none')}</p>
        )}
      </CCardBody>
    </CCard>
  );

  return (
    <CContainer fluid>
      {/* Header */}
      <CRow className="mb-4">
        <CCol>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2>
                {t('incident.details.title')} #{incident.incidentNumber}
                {incident.isAnonymous && (
                  <CBadge color="secondary" className="ms-2">Anonymous</CBadge>
                )}
              </h2>
              <h5 className="text-muted mb-0">{incident.title}</h5>
            </div>
            {renderHeaderActions()}
          </div>
        </CCol>
      </CRow>

      {/* Navigation Tabs */}
      <CCard className="mb-4">
        <CCardHeader>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                <CIcon icon={cilInfo} className="me-2" />
                {t('incident.tabs.overview')}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'people'}
                onClick={() => setActiveTab('people')}
              >
                <CIcon icon={cilPeople} className="me-2" />
                {t('incident.tabs.people')}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'medical'}
                onClick={() => setActiveTab('medical')}
              >
                <CIcon icon={cilMedicalCross} className="me-2" />
                {t('incident.tabs.medical')}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'investigation'}
                onClick={() => setActiveTab('investigation')}
              >
                <CIcon icon={cilMagnifyingGlass} className="me-2" />
                {t('incident.tabs.investigation')}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'compliance'}
                onClick={() => setActiveTab('compliance')}
              >
                <CIcon icon={cilShieldAlt} className="me-2" />
                {t('incident.tabs.compliance')}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'evidence'}
                onClick={() => setActiveTab('evidence')}
              >
                <CIcon icon={cilCamera} className="me-2" />
                {t('incident.tabs.evidence')}
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 'overview'}>
              {renderOverviewTab()}
            </CTabPane>
            <CTabPane visible={activeTab === 'people'}>
              {renderPeopleTab()}
            </CTabPane>
            <CTabPane visible={activeTab === 'medical'}>
              {renderMedicalTab()}
            </CTabPane>
            <CTabPane visible={activeTab === 'investigation'}>
              {renderInvestigationTab()}
            </CTabPane>
            <CTabPane visible={activeTab === 'compliance'}>
              {renderComplianceTab()}
            </CTabPane>
            <CTabPane visible={activeTab === 'evidence'}>
              {renderEvidenceTab()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Comments Section */}
      {renderComments()}

      {/* Modals */}
      {/* Investigation Modal */}
      <CModal
        visible={showInvestigationModal}
        onClose={() => setShowInvestigationModal(false)}
      >
        <CModalHeader>
          <CModalTitle>{t('incident.investigation.start')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            rows={4}
            placeholder={t('incident.investigation.notesPlaceholder')}
            value={investigationNotes}
            onChange={(e) => setInvestigationNotes(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowInvestigationModal(false)}>
            {t('common.cancel')}
          </CButton>
          <CButton color="primary" onClick={handleStartInvestigation}>
            {t('common.start')}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Notification Modal */}
      <CModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      >
        <CModalHeader>
          <CModalTitle>{t('incident.notification.send')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            value={notificationRecipient}
            onChange={(e) => setNotificationRecipient(e.target.value)}
          >
            <option value="parent">{t('incident.notification.parent')}</option>
            <option value="emergency">{t('incident.notification.emergency')}</option>
            <option value="regulatory">{t('incident.notification.regulatory')}</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowNotificationModal(false)}>
            {t('common.cancel')}
          </CButton>
          <CButton color="primary" onClick={handleSendNotification}>
            <CIcon icon={cilSend} className="me-2" />
            {t('common.send')}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Comment Modal */}
      <CModal
        visible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
      >
        <CModalHeader>
          <CModalTitle>{t('incident.comments.add')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            rows={4}
            placeholder={t('incident.comments.placeholder')}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCommentModal(false)}>
            {t('common.cancel')}
          </CButton>
          <CButton color="primary" onClick={handleAddComment} disabled={!commentText.trim()}>
            {t('common.add')}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Timeline Offcanvas */}
      <COffcanvas placement="end" visible={showTimelineOffcanvas} onHide={() => setShowTimelineOffcanvas(false)}>
        <COffcanvasHeader>
          <COffcanvasTitle>{t('incident.timeline.title')}</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setShowTimelineOffcanvas(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          {incident.timeline && incident.timeline.length > 0 ? (
            <div className="timeline">
              {incident.timeline.map((event) => (
                <div key={event.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong>{event.action}</strong>
                      <small className="text-muted">
                        {format(parseISO(event.timestamp), 'dd/MM HH:mm')}
                      </small>
                    </div>
                    <p className="mb-1">{event.details}</p>
                    <small className="text-muted">by {event.user}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">{t('incident.timeline.empty')}</p>
          )}
        </COffcanvasBody>
      </COffcanvas>
    </CContainer>
  );
};

export default IncidentDetailsEnhanced;