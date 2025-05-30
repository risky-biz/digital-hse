import React, { useState, useEffect } from 'react'
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
  CListGroup,
  CListGroupItem,
  CSpinner,
  CToast,
  CToastBody,
  CToaster,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CFormCheck,
  CFormSelect,
  CTabContent,
  CTabPanel,
  CTabs,
  CTabList,
  CTab,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilBellExclamation,
  cilWarning,
  cilChild,
  cilPhone,
  cilShieldAlt,
  cilClock,
  cilMedicalCross,
  cilCheckCircle,
  cilX,
  cilSettings,
  cilEnvelopeClosed,
  cilPhonebook,
  cilChatBubble,
} from '@coreui/icons'

interface NotificationData {
  id: number
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  recipientRole: string
  recipientName: string
  incidentNumber?: string
  studentName?: string
  parentContact?: string
  isRead: boolean
  isRegulatoryRequired: boolean
  regulatoryBody?: string
  regulatoryDeadline?: string
  createdAt: string
  sentAt?: string
  deliveredAt?: string
  readAt?: string
  channels: NotificationChannel[]
  status: NotificationStatus
  retryCount: number
  errorMessage?: string
}

enum NotificationType {
  INCIDENT_REPORTED = 'incident_reported',
  PARENT_NOTIFICATION = 'parent_notification',
  REGULATORY_REPORT = 'regulatory_report',
  INVESTIGATION_ASSIGNED = 'investigation_assigned',
  CAPA_ASSIGNED = 'capa_assigned',
  DEADLINE_REMINDER = 'deadline_reminder',
  OVERDUE_ALERT = 'overdue_alert'
}

enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
  IN_APP = 'in_app'
}

enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

interface NotificationCenterProps {
  visible: boolean
  onClose: () => void
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ visible, onClose }) => {
  const { t } = useTranslation(['hse', 'common'])
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [toast, addToast] = useState<any>(0)
  
  // Mock notification data with BSJ school-specific scenarios
  const mockNotifications: NotificationData[] = [
    {
      id: 1,
      type: NotificationType.PARENT_NOTIFICATION,
      priority: NotificationPriority.HIGH,
      title: 'Student Injury - Immediate Attention Required',
      message: 'Your child Ahmad Rizki (Class 8A) has been injured during PE class. Medical attention has been provided. Please contact the school immediately.',
      recipientRole: 'Parent',
      recipientName: 'Mr. Budi Rizki',
      incidentNumber: 'INC-20240115-1234',
      studentName: 'Ahmad Rizki',
      parentContact: '+62812-3456-7890',
      isRead: false,
      isRegulatoryRequired: false,
      createdAt: '2024-01-15T10:45:00',
      sentAt: '2024-01-15T10:46:00',
      deliveredAt: '2024-01-15T10:46:30',
      channels: [NotificationChannel.SMS, NotificationChannel.WHATSAPP, NotificationChannel.EMAIL],
      status: NotificationStatus.DELIVERED,
      retryCount: 0
    },
    {
      id: 2,
      type: NotificationType.REGULATORY_REPORT,
      priority: NotificationPriority.CRITICAL,
      title: 'URGENT: BPJS Ketenagakerjaan Report Required',
      message: 'Laboratory incident INC-20240114-5678 requires immediate BPJS reporting within 24 hours. Deadline: 16 Jan 2024, 14:20.',
      recipientRole: 'HSE Manager',
      recipientName: 'Dr. Sari Indrawati',
      incidentNumber: 'INC-20240114-5678',
      isRead: false,
      isRegulatoryRequired: true,
      regulatoryBody: 'BPJS Ketenagakerjaan',
      regulatoryDeadline: '2024-01-16T14:20:00',
      createdAt: '2024-01-14T14:25:00',
      sentAt: '2024-01-14T14:25:30',
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH, NotificationChannel.SMS],
      status: NotificationStatus.SENT,
      retryCount: 0
    },
    {
      id: 3,
      type: NotificationType.OVERDUE_ALERT,
      priority: NotificationPriority.CRITICAL,
      title: 'OVERDUE: Bullying Incident Regulatory Report',
      message: 'Ministry of Education report for bullying incident INC-20240112-3456 is overdue. Immediate action required to ensure compliance.',
      recipientRole: 'Principal',
      recipientName: 'Dr. Hartono Wijaya',
      incidentNumber: 'INC-20240112-3456',
      studentName: 'Budi Santoso',
      isRead: false,
      isRegulatoryRequired: true,
      regulatoryBody: 'Ministry of Education',
      regulatoryDeadline: '2024-01-12T09:45:00',
      createdAt: '2024-01-13T09:45:00',
      sentAt: '2024-01-13T09:45:15',
      deliveredAt: '2024-01-13T09:45:30',
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH, NotificationChannel.SMS],
      status: NotificationStatus.DELIVERED,
      retryCount: 0
    },
    {
      id: 4,
      type: NotificationType.INVESTIGATION_ASSIGNED,
      priority: NotificationPriority.MEDIUM,
      title: 'Investigation Assignment - Sports Injury',
      message: 'You have been assigned as the lead investigator for incident INC-20240115-1234. Please begin investigation within 24 hours.',
      recipientRole: 'Investigator',
      recipientName: 'Dr. Ahmad Wijaya',
      incidentNumber: 'INC-20240115-1234',
      isRead: true,
      isRegulatoryRequired: false,
      createdAt: '2024-01-15T11:00:00',
      sentAt: '2024-01-15T11:00:30',
      deliveredAt: '2024-01-15T11:01:00',
      readAt: '2024-01-15T11:15:00',
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      status: NotificationStatus.READ,
      retryCount: 0
    },
    {
      id: 5,
      type: NotificationType.DEADLINE_REMINDER,
      priority: NotificationPriority.MEDIUM,
      title: 'Reminder: Investigation Due Tomorrow',
      message: 'Investigation for playground accident INC-20240113-9012 is due tomorrow (22 Jan 2024). Please ensure completion on time.',
      recipientRole: 'Investigator',
      recipientName: 'Ms. Linda Chen',
      incidentNumber: 'INC-20240113-9012',
      isRead: false,
      isRegulatoryRequired: false,
      createdAt: '2024-01-21T09:00:00',
      sentAt: '2024-01-21T09:00:15',
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      status: NotificationStatus.SENT,
      retryCount: 0
    },
    {
      id: 6,
      type: NotificationType.PARENT_NOTIFICATION,
      priority: NotificationPriority.LOW,
      title: 'Incident Report Update - No Further Action Required',
      message: 'Update on playground incident involving your child Sari Dewi (Class 3B): Investigation completed, equipment repaired, no further medical attention needed.',
      recipientRole: 'Parent',
      recipientName: 'Mrs. Dewi Sari',
      incidentNumber: 'INC-20240113-9012',
      studentName: 'Sari Dewi',
      parentContact: 'dewi.sari@email.com',
      isRead: false,
      isRegulatoryRequired: false,
      createdAt: '2024-01-20T15:30:00',
      sentAt: '2024-01-20T15:30:30',
      deliveredAt: '2024-01-20T15:31:00',
      channels: [NotificationChannel.EMAIL, NotificationChannel.WHATSAPP],
      status: NotificationStatus.DELIVERED,
      retryCount: 0
    }
  ]

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNotifications(mockNotifications)
      setLoading(false)
    }
    
    if (visible) {
      loadNotifications()
    }
  }, [visible])

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.isRead)
      case 'regulatory':
        return notifications.filter(n => n.isRegulatoryRequired)
      case 'parent':
        return notifications.filter(n => n.type === NotificationType.PARENT_NOTIFICATION)
      case 'urgent':
        return notifications.filter(n => n.priority === NotificationPriority.CRITICAL || n.priority === NotificationPriority.HIGH)
      default:
        return notifications
    }
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL: return 'danger'
      case NotificationPriority.HIGH: return 'warning'
      case NotificationPriority.MEDIUM: return 'info'
      case NotificationPriority.LOW: return 'light'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.PARENT_NOTIFICATION: return cilChild
      case NotificationType.REGULATORY_REPORT: return cilShieldAlt
      case NotificationType.INVESTIGATION_ASSIGNED: return cilWarning
      case NotificationType.DEADLINE_REMINDER: return cilClock
      case NotificationType.OVERDUE_ALERT: return cilBellExclamation
      default: return cilBell
    }
  }

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case NotificationChannel.EMAIL: return cilEnvelopeClosed
      case NotificationChannel.SMS: return cilPhone
      case NotificationChannel.WHATSAPP: return cilChatBubble
      case NotificationChannel.PUSH: return cilBell
      default: return cilChatBubble
    }
  }

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true, readAt: new Date().toISOString(), status: NotificationStatus.READ }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ 
        ...notification, 
        isRead: true, 
        readAt: new Date().toISOString(),
        status: notification.status === NotificationStatus.DELIVERED ? NotificationStatus.READ : notification.status
      }))
    )
    
    addToast(
      <CToast color="success">
        <CToastBody>All notifications marked as read</CToastBody>
      </CToast>
    )
  }

  const resendNotification = async (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: NotificationStatus.SENT, retryCount: notification.retryCount + 1, sentAt: new Date().toISOString() }
          : notification
      )
    )
    
    addToast(
      <CToast color="success">
        <CToastBody>Notification resent successfully</CToastBody>
      </CToast>
    )
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.isRead).length
  const urgentCount = notifications.filter(n => n.priority === NotificationPriority.CRITICAL).length
  const regulatoryCount = notifications.filter(n => n.isRegulatoryRequired && !n.isRead).length

  return (
    <>
      <COffcanvas placement="end" visible={visible} onHide={onClose} size="lg">
        <COffcanvasHeader>
          <h5>
            <CIcon icon={cilBell} className="me-2" />
            Notification Center
            {unreadCount > 0 && (
              <CBadge color="danger" className="ms-2">{unreadCount}</CBadge>
            )}
          </h5>
          <div className="d-flex gap-2">
            <CButton 
              color="secondary" 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <CIcon icon={cilSettings} />
            </CButton>
            <CButton 
              color="primary" 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </CButton>
          </div>
        </COffcanvasHeader>
        
        <COffcanvasBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <div className="mt-2">Loading notifications...</div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="p-3 border-bottom bg-light">
                <CRow className="g-2">
                  <CCol xs={3}>
                    <div className="text-center">
                      <div className="h6 mb-0">{unreadCount}</div>
                      <small className="text-muted">Unread</small>
                    </div>
                  </CCol>
                  <CCol xs={3}>
                    <div className="text-center">
                      <div className="h6 mb-0 text-danger">{urgentCount}</div>
                      <small className="text-muted">Urgent</small>
                    </div>
                  </CCol>
                  <CCol xs={3}>
                    <div className="text-center">
                      <div className="h6 mb-0 text-warning">{regulatoryCount}</div>
                      <small className="text-muted">Regulatory</small>
                    </div>
                  </CCol>
                  <CCol xs={3}>
                    <div className="text-center">
                      <div className="h6 mb-0">{notifications.length}</div>
                      <small className="text-muted">Total</small>
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Filter Tabs */}
              <CTabs activeItemKey={activeTab} onActiveItemKeyChange={setActiveTab}>
                <CTabList variant="tabs" className="border-bottom">
                  <CTab itemKey="all">All</CTab>
                  <CTab itemKey="unread">
                    Unread
                    {unreadCount > 0 && <CBadge color="danger" className="ms-1">{unreadCount}</CBadge>}
                  </CTab>
                  <CTab itemKey="regulatory">
                    Regulatory
                    {regulatoryCount > 0 && <CBadge color="warning" className="ms-1">{regulatoryCount}</CBadge>}
                  </CTab>
                  <CTab itemKey="parent">Parent</CTab>
                  <CTab itemKey="urgent">Urgent</CTab>
                </CTabList>
                
                <CTabContent>
                  <CTabPanel itemKey={activeTab}>
                    <CListGroup flush>
                      {filteredNotifications.length === 0 ? (
                        <CListGroupItem className="text-center py-4 text-muted">
                          <CIcon icon={cilBell} size="xl" className="mb-2" />
                          <div>No notifications found</div>
                        </CListGroupItem>
                      ) : (
                        filteredNotifications.map((notification) => (
                          <CListGroupItem
                            key={notification.id}
                            className={`border-start border-3 border-${getPriorityColor(notification.priority)} ${!notification.isRead ? 'bg-light' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedNotification(notification)
                              if (!notification.isRead) {
                                markAsRead(notification.id)
                              }
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex align-items-start flex-grow-1">
                                <div className="me-3 mt-1">
                                  <CIcon 
                                    icon={getTypeIcon(notification.type)} 
                                    className={`text-${getPriorityColor(notification.priority)}`}
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start mb-1">
                                    <h6 className={`mb-1 ${!notification.isRead ? 'fw-bold' : ''}`}>
                                      {notification.title}
                                    </h6>
                                    <small className="text-muted">
                                      {new Date(notification.createdAt).toLocaleTimeString()}
                                    </small>
                                  </div>
                                  
                                  <p className="mb-2 text-muted small">
                                    {notification.message}
                                  </p>
                                  
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-1">
                                      <CBadge color={getPriorityColor(notification.priority)}>
                                        {notification.priority.toUpperCase()}
                                      </CBadge>
                                      {notification.isRegulatoryRequired && (
                                        <CBadge color="warning">
                                          <CIcon icon={cilShieldAlt} className="me-1" size="sm" />
                                          Regulatory
                                        </CBadge>
                                      )}
                                      {notification.studentName && (
                                        <CBadge color="info">
                                          <CIcon icon={cilChild} className="me-1" size="sm" />
                                          {notification.studentName}
                                        </CBadge>
                                      )}
                                    </div>
                                    
                                    <div className="d-flex gap-1">
                                      {notification.channels.map((channel, index) => (
                                        <CIcon 
                                          key={index}
                                          icon={getChannelIcon(channel)} 
                                          className="text-muted" 
                                          size="sm"
                                          title={channel.toUpperCase()}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {notification.regulatoryDeadline && (
                                    <CAlert color="warning" className="mt-2 mb-0 py-1 px-2 small">
                                      <CIcon icon={cilClock} className="me-1" />
                                      Deadline: {new Date(notification.regulatoryDeadline).toLocaleString()}
                                    </CAlert>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CListGroupItem>
                        ))
                      )}
                    </CListGroup>
                  </CTabPanel>
                </CTabContent>
              </CTabs>
            </>
          )}
        </COffcanvasBody>
      </COffcanvas>

      {/* Notification Details Modal */}
      <CModal visible={!!selectedNotification} onClose={() => setSelectedNotification(null)} size="lg">
        {selectedNotification && (
          <>
            <CModalHeader>
              <CModalTitle>
                <CIcon icon={getTypeIcon(selectedNotification.type)} className="me-2" />
                {selectedNotification.title}
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="mb-3">
                <div className="d-flex gap-2 mb-2">
                  <CBadge color={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority.toUpperCase()}
                  </CBadge>
                  {selectedNotification.isRegulatoryRequired && (
                    <CBadge color="warning">Regulatory Required</CBadge>
                  )}
                  <CBadge color={selectedNotification.status === NotificationStatus.DELIVERED ? 'success' : 'secondary'}>
                    {selectedNotification.status.toUpperCase()}
                  </CBadge>
                </div>
                
                <p>{selectedNotification.message}</p>
              </div>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <small className="text-muted">Recipient</small>
                    <div className="fw-semibold">
                      {selectedNotification.recipientName} ({selectedNotification.recipientRole})
                    </div>
                  </div>
                  
                  {selectedNotification.incidentNumber && (
                    <div className="mb-3">
                      <small className="text-muted">Incident Number</small>
                      <div className="fw-semibold">{selectedNotification.incidentNumber}</div>
                    </div>
                  )}
                  
                  {selectedNotification.studentName && (
                    <div className="mb-3">
                      <small className="text-muted">Student</small>
                      <div className="fw-semibold">{selectedNotification.studentName}</div>
                    </div>
                  )}
                </CCol>
                
                <CCol md={6}>
                  <div className="mb-3">
                    <small className="text-muted">Created</small>
                    <div>{new Date(selectedNotification.createdAt).toLocaleString()}</div>
                  </div>
                  
                  {selectedNotification.sentAt && (
                    <div className="mb-3">
                      <small className="text-muted">Sent</small>
                      <div>{new Date(selectedNotification.sentAt).toLocaleString()}</div>
                    </div>
                  )}
                  
                  {selectedNotification.deliveredAt && (
                    <div className="mb-3">
                      <small className="text-muted">Delivered</small>
                      <div>{new Date(selectedNotification.deliveredAt).toLocaleString()}</div>
                    </div>
                  )}
                </CCol>
              </CRow>

              <div className="mb-3">
                <small className="text-muted">Channels Used</small>
                <div className="d-flex gap-2 mt-1">
                  {selectedNotification.channels.map((channel, index) => (
                    <CBadge key={index} color="secondary">
                      <CIcon icon={getChannelIcon(channel)} className="me-1" />
                      {channel.toUpperCase()}
                    </CBadge>
                  ))}
                </div>
              </div>

              {selectedNotification.regulatoryDeadline && (
                <CAlert color="warning">
                  <CIcon icon={cilClock} className="me-2" />
                  <strong>Regulatory Deadline:</strong> {new Date(selectedNotification.regulatoryDeadline).toLocaleString()}
                  <br />
                  <strong>Regulatory Body:</strong> {selectedNotification.regulatoryBody}
                </CAlert>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton 
                color="secondary" 
                onClick={() => resendNotification(selectedNotification.id)}
              >
                <CIcon icon={cilPhone} className="me-2" />
                Resend
              </CButton>
              <CButton color="primary" onClick={() => setSelectedNotification(null)}>
                Close
              </CButton>
            </CModalFooter>
          </>
        )}
      </CModal>

      {/* Settings Modal */}
      <CModal visible={showSettings} onClose={() => setShowSettings(false)}>
        <CModalHeader>
          <CModalTitle>Notification Settings</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <h6>Notification Channels</h6>
            <CFormCheck id="email" label="Email Notifications" defaultChecked />
            <CFormCheck id="sms" label="SMS Notifications" defaultChecked />
            <CFormCheck id="whatsapp" label="WhatsApp Notifications" defaultChecked />
            <CFormCheck id="push" label="Push Notifications" defaultChecked />
          </div>
          
          <div className="mb-3">
            <h6>Priority Levels</h6>
            <CFormCheck id="critical" label="Critical Priority" defaultChecked />
            <CFormCheck id="high" label="High Priority" defaultChecked />
            <CFormCheck id="medium" label="Medium Priority" defaultChecked />
            <CFormCheck id="low" label="Low Priority" />
          </div>
          
          <div className="mb-3">
            <h6>Regulatory Notifications</h6>
            <CFormCheck id="bpjs" label="BPJS Ketenagakerjaan Reports" defaultChecked />
            <CFormCheck id="ministry" label="Ministry of Education Reports" defaultChecked />
            <CFormCheck id="overdue" label="Overdue Alerts" defaultChecked />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSettings(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => setShowSettings(false)}>
            Save Settings
          </CButton>
        </CModalFooter>
      </CModal>

      <CToaster ref={toast} push={toast} placement="top-end" />
    </>
  )
}

export default NotificationCenter