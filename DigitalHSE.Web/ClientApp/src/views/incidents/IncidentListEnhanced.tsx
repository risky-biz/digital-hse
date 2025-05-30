import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CButtonGroup,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CBadge,
  CTooltip,
  CSpinner,
  CAlert,
  CPagination,
  CPaginationItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCollapse,
  CFormCheck,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CProgress,
  CProgressBar,
  CCallout,
  CWidgetStatsF,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
} from '@coreui/react';
import {
  cilFilter,
  cilSearch,
  cilSortAscending,
  cilSortDescending,
  cilWarning,
  cilCheckCircle,
  cilClock,
  cilBan,
  cilPeople,
  cilMedicalCross,
  cilHome,
  cilUser,
  cilLocationPin,
  cilCalendar,
  cilCloudDownload,
  cilPrint,
  cilChartPie,
  cilSettings,
  cilReload,
  cilPlus,
  cilPencil,
  cilMagnifyingGlass,
  cilInfo,
  cilX,
  cilArrowThickFromBottom,
  cilArrowThickFromTop,
  cilList,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isToday, isYesterday, differenceInDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import { incidentApi } from '../../services/incidentApi';

// Types
interface IncidentListItem {
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
  
  // Location
  location: string;
  building: string;
  floor: string;
  department: string;
  latitude?: number;
  longitude?: number;
  
  // People
  reportedBy: string;
  reporterType: string;
  reporterTypeDisplay: string;
  personAffectedType?: string;
  personAffectedTypeDisplay?: string;
  personAffectedName?: string;
  personAffectedClass?: string;
  
  // Investigation
  investigationStatus: string;
  investigationStatusDisplay: string;
  investigatedBy?: string;
  investigationDueDate?: string;
  isOverdue: boolean;
  daysOverdue?: number;
  
  // Compliance
  requiresBPJSReporting: boolean;
  bpjsReferenceNumber?: string;
  requiresMinistryReporting: boolean;
  ministryReferenceNumber?: string;
  isRegulatoryOverdue: boolean;
  regulatoryDeadline?: string;
  
  // Parent notification
  isStudentIncident: boolean;
  parentNotified: boolean;
  parentNotificationTime?: string;
  
  // Medical
  requiresMedicalAttention: boolean;
  hospitalName?: string;
  
  // Metrics
  daysOld: number;
  completionPercentage: number;
  urgencyReasons: string[];
  
  // UI helpers
  severityBadgeClass: string;
  statusBadgeClass: string;
  typeIcon: string;
  isUrgent: boolean;
  ageDisplay: string;
}

interface IncidentStatistics {
  total: number;
  open: number;
  investigating: number;
  closed: number;
  overdue: number;
  highSeverity: number;
  requiresAction: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  byCategoryCount: Record<string, number>;
  byLocationCount: Record<string, number>;
  byPersonTypeCount: Record<string, number>;
  averageResolutionTime: number;
  complianceRate: number;
}

interface FilterState {
  searchTerm: string;
  category: string;
  type: string;
  severity: string;
  urgency: string;
  status: string;
  investigationStatus: string;
  dateFrom: string;
  dateTo: string;
  department: string;
  building: string;
  location: string;
  personAffectedType: string;
  reporterType: string;
  isStudentIncident: string;
  isAnonymous: string;
  requiresBPJSReporting: string;
  requiresMinistryReporting: string;
  isOverdue: string;
  isRegulatoryDeadlinePending: string;
  requiresMedicalAttention: string;
  parentNotified: string;
  academicYear: string;
  term: string;
}

const IncidentListEnhanced: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State management
  const [incidents, setIncidents] = useState<IncidentListItem[]>([]);
  const [statistics, setStatistics] = useState<IncidentStatistics | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('incidentDateTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30 seconds
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [exportLoading, setExportLoading] = useState(false);
  const [quickDateFilter, setQuickDateFilter] = useState('all');

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: '',
    type: '',
    severity: '',
    urgency: '',
    status: '',
    investigationStatus: '',
    dateFrom: '',
    dateTo: '',
    department: '',
    building: '',
    location: '',
    personAffectedType: '',
    reporterType: '',
    isStudentIncident: '',
    isAnonymous: '',
    requiresBPJSReporting: '',
    requiresMinistryReporting: '',
    isOverdue: '',
    isRegulatoryDeadlinePending: '',
    requiresMedicalAttention: '',
    parentNotified: '',
    academicYear: '',
    term: '',
  });

  // Dropdown data
  const [dropdownData, setDropdownData] = useState({
    categories: [],
    types: [],
    severities: [],
    urgencies: [],
    personTypes: [],
    statuses: [],
    investigationStatuses: [],
  });

  // Total pages calculation
  const totalPages = Math.ceil(totalItems / pageSize);

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [categories, types, severities, urgencies, personTypes] = await Promise.all([
          incidentApi.get('/api/incident/categories'),
          incidentApi.get('/api/incident/types'),
          incidentApi.get('/api/incident/severities'),
          incidentApi.get('/api/incident/urgencies'),
          incidentApi.get('/api/incident/person-types'),
        ]);

        // Handle the response format - the data might be directly in the response
        const getDataArray = (response: any) => {
          if (response.success && Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response)) {
            return response;
          }
          return [];
        };

        setDropdownData({
          categories: getDataArray(categories),
          types: getDataArray(types),
          severities: getDataArray(severities),
          urgencies: getDataArray(urgencies),
          personTypes: getDataArray(personTypes),
          statuses: [
            { value: 'Reported', display: t('incident.status.reported') },
            { value: 'Acknowledged', display: t('incident.status.acknowledged') },
            { value: 'InProgress', display: t('incident.status.inProgress') },
            { value: 'Resolved', display: t('incident.status.resolved') },
            { value: 'Closed', display: t('incident.status.closed') },
          ],
          investigationStatuses: [
            { value: 'NotStarted', display: t('incident.investigation.notStarted') },
            { value: 'InProgress', display: t('incident.investigation.inProgress') },
            { value: 'Completed', display: t('incident.investigation.completed') },
          ],
        });
      } catch (error) {
        console.error('Failed to load dropdown data:', error);
        // toast.error(t('incident.errors.loadingData'));
        
        // Set empty arrays as fallback
        setDropdownData({
          categories: [],
          types: [],
          severities: [],
          urgencies: [],
          personTypes: [],
          statuses: [
            { value: 'Reported', display: t('incident.status.reported') },
            { value: 'Acknowledged', display: t('incident.status.acknowledged') },
            { value: 'InProgress', display: t('incident.status.inProgress') },
            { value: 'Resolved', display: t('incident.status.resolved') },
            { value: 'Closed', display: t('incident.status.closed') },
          ],
          investigationStatuses: [
            { value: 'NotStarted', display: t('incident.investigation.notStarted') },
            { value: 'InProgress', display: t('incident.investigation.inProgress') },
            { value: 'Completed', display: t('incident.investigation.completed') },
          ],
        });
      }
    };

    loadDropdownData();
  }, [t]);

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.append('pageNumber', currentPage.toString());
    params.append('pageSize', pageSize.toString());
    params.append('sortBy', sortBy);
    params.append('sortDirection', sortDirection);

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return params.toString();
  }, [currentPage, pageSize, sortBy, sortDirection, filters]);

  // Load incidents
  const loadIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const queryString = buildQueryParams();
      const response = await incidentApi.get(`/api/incident?${queryString}`);
      
      if (response.success) {
        setIncidents(response.data.items || []);
        setTotalItems(response.data.totalCount || 0);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Failed to load incidents:', error);
      toast.error(t('incident.errors.loadingIncidents'));
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, t]);

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const response = await incidentApi.get('/api/incident/statistics');
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }, []);

  // Initial load and refresh
  useEffect(() => {
    loadIncidents();
    loadStatistics();
  }, [loadIncidents, loadStatistics]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        loadIncidents();
        loadStatistics();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, loadIncidents, loadStatistics]);

  // Quick date filter
  useEffect(() => {
    const now = new Date();
    let dateFrom = '';
    let dateTo = '';

    switch (quickDateFilter) {
      case 'today':
        dateFrom = format(now, 'yyyy-MM-dd');
        dateTo = format(now, 'yyyy-MM-dd');
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        dateFrom = format(yesterday, 'yyyy-MM-dd');
        dateTo = format(yesterday, 'yyyy-MM-dd');
        break;
      case 'thisWeek':
        dateFrom = format(startOfWeek(now), 'yyyy-MM-dd');
        dateTo = format(endOfWeek(now), 'yyyy-MM-dd');
        break;
      case 'thisMonth':
        dateFrom = format(startOfMonth(now), 'yyyy-MM-dd');
        dateTo = format(endOfMonth(now), 'yyyy-MM-dd');
        break;
      case 'last7Days':
        const last7Days = new Date(now);
        last7Days.setDate(last7Days.getDate() - 7);
        dateFrom = format(last7Days, 'yyyy-MM-dd');
        dateTo = format(now, 'yyyy-MM-dd');
        break;
      case 'last30Days':
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 30);
        dateFrom = format(last30Days, 'yyyy-MM-dd');
        dateTo = format(now, 'yyyy-MM-dd');
        break;
    }

    setFilters(prev => ({ ...prev, dateFrom, dateTo }));
  }, [quickDateFilter]);

  // Handle filter changes
  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      type: '',
      severity: '',
      urgency: '',
      status: '',
      investigationStatus: '',
      dateFrom: '',
      dateTo: '',
      department: '',
      building: '',
      location: '',
      personAffectedType: '',
      reporterType: '',
      isStudentIncident: '',
      isAnonymous: '',
      requiresBPJSReporting: '',
      requiresMinistryReporting: '',
      isOverdue: '',
      isRegulatoryDeadlinePending: '',
      requiresMedicalAttention: '',
      parentNotified: '',
      academicYear: '',
      term: '',
    });
    setQuickDateFilter('all');
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Handle row selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIncidents(incidents.map(i => i.id));
    } else {
      setSelectedIncidents([]);
    }
  };

  const handleSelectIncident = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIncidents(prev => [...prev, id]);
    } else {
      setSelectedIncidents(prev => prev.filter(i => i !== id));
    }
  };

  // Export functionality
  const handleExport = async (format: 'excel' | 'csv') => {
    setExportLoading(true);
    try {
      const queryString = buildQueryParams();
      const response = await incidentApi.get(`/api/incident/export?format=${format}&${queryString}`);

      if (response.success) {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `incidents_${format}_${format(new Date(), 'yyyyMMdd_HHmmss')}.${format === 'excel' ? 'xlsx' : 'csv'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success(t('incident.export.success'));
      } else {
        toast.error(response.message || t('incident.export.error'));
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(t('incident.export.error'));
    } finally {
      setExportLoading(false);
    }
  };

  // Get severity color
  const getSeverityColor = (severity: number): string => {
    switch (severity) {
      case 5: return 'danger';
      case 4: return 'warning';
      case 3: return 'info';
      case 2: return 'primary';
      default: return 'secondary';
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Closed': return 'success';
      case 'Resolved': return 'info';
      case 'InProgress': return 'primary';
      case 'Acknowledged': return 'warning';
      default: return 'secondary';
    }
  };

  // Get investigation status color
  const getInvestigationStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed': return 'success';
      case 'InProgress': return 'primary';
      default: return 'secondary';
    }
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== '').length;
  }, [filters]);

  // Render statistics cards
  const renderStatistics = () => {
    if (!statistics) return null;

    return (
      <CRow className="mb-4">
        <CCol xs={6} md={3}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilWarning} height={24} />}
            title={t('incident.stats.total')}
            value={statistics.total}
            footer={
              <span className="text-medium-emphasis">
                {statistics.todayCount} {t('incident.stats.today')}
              </span>
            }
          />
        </CCol>
        <CCol xs={6} md={3}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilClock} height={24} />}
            title={t('incident.stats.open')}
            value={statistics.open}
            footer={
              <span className="text-medium-emphasis">
                {statistics.investigating} {t('incident.stats.investigating')}
              </span>
            }
          />
        </CCol>
        <CCol xs={6} md={3}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilWarning} height={24} />}
            title={t('incident.stats.overdue')}
            value={statistics.overdue}
            footer={
              <span className="text-medium-emphasis">
                {statistics.highSeverity} {t('incident.stats.highSeverity')}
              </span>
            }
          />
        </CCol>
        <CCol xs={6} md={3}>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilCheckCircle} height={24} />}
            title={t('incident.stats.closed')}
            value={statistics.closed}
            footer={
              <CProgress thin className="mt-3" color="success" value={statistics.complianceRate || 0}>
                <CProgressBar value={statistics.complianceRate}>
                  {statistics.complianceRate}% {t('incident.stats.compliant')}
                </CProgressBar>
              </CProgress>
            }
          />
        </CCol>
      </CRow>
    );
  };

  // Render filters sidebar
  const renderFilters = () => (
    <COffcanvas placement="end" visible={showFilters} onHide={() => setShowFilters(false)} className="w-auto">
      <COffcanvasHeader>
        <COffcanvasTitle>{t('incident.filters.title')}</COffcanvasTitle>
        <CCloseButton className="text-reset" onClick={() => setShowFilters(false)} />
      </COffcanvasHeader>
      <COffcanvasBody>
        <div className="d-grid gap-3" style={{ minWidth: '350px' }}>
          {/* Search */}
          <div>
            <label className="form-label">{t('incident.filters.search')}</label>
            <CFormInput
              type="text"
              placeholder={t('incident.filters.searchPlaceholder')}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>

          {/* Quick Date Filters */}
          <div>
            <label className="form-label">{t('incident.filters.dateRange')}</label>
            <CFormSelect
              value={quickDateFilter}
              onChange={(e) => setQuickDateFilter(e.target.value)}
            >
              <option value="all">{t('incident.filters.allTime')}</option>
              <option value="today">{t('incident.filters.today')}</option>
              <option value="yesterday">{t('incident.filters.yesterday')}</option>
              <option value="thisWeek">{t('incident.filters.thisWeek')}</option>
              <option value="thisMonth">{t('incident.filters.thisMonth')}</option>
              <option value="last7Days">{t('incident.filters.last7Days')}</option>
              <option value="last30Days">{t('incident.filters.last30Days')}</option>
            </CFormSelect>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">{t('incident.filters.category')}</label>
            <CFormSelect
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {Array.isArray(dropdownData.categories) && dropdownData.categories.map((cat: any) => (
                <option key={cat.value} value={cat.value}>
                  {cat.display}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* Type */}
          <div>
            <label className="form-label">{t('incident.filters.type')}</label>
            <CFormSelect
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {Array.isArray(dropdownData.types) && dropdownData.types.map((type: any) => (
                <option key={type.value} value={type.value}>
                  {type.display}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* Severity */}
          <div>
            <label className="form-label">{t('incident.filters.severity')}</label>
            <CFormSelect
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {Array.isArray(dropdownData.severities) && dropdownData.severities.map((sev: any) => (
                <option key={sev.value} value={sev.value}>
                  {sev.display}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* Status */}
          <div>
            <label className="form-label">{t('incident.filters.status')}</label>
            <CFormSelect
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {Array.isArray(dropdownData.statuses) && dropdownData.statuses.map((status: any) => (
                <option key={status.value} value={status.value}>
                  {status.display}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* Investigation Status */}
          <div>
            <label className="form-label">{t('incident.filters.investigationStatus')}</label>
            <CFormSelect
              value={filters.investigationStatus}
              onChange={(e) => handleFilterChange('investigationStatus', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {Array.isArray(dropdownData.investigationStatuses) && dropdownData.investigationStatuses.map((status: any) => (
                <option key={status.value} value={status.value}>
                  {status.display}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* Building */}
          <div>
            <label className="form-label">{t('incident.filters.building')}</label>
            <CFormInput
              type="text"
              value={filters.building}
              onChange={(e) => handleFilterChange('building', e.target.value)}
            />
          </div>

          {/* Person Type */}
          <div>
            <label className="form-label">{t('incident.filters.personAffectedType')}</label>
            <CFormSelect
              value={filters.personAffectedType}
              onChange={(e) => handleFilterChange('personAffectedType', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {Array.isArray(dropdownData.personTypes) && dropdownData.personTypes.map((type: any) => (
                <option key={type.value} value={type.value}>
                  {type.display}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* Special Filters */}
          <div>
            <label className="form-label">{t('incident.filters.special')}</label>
            <CFormCheck
              id="isStudentIncident"
              label={t('incident.filters.studentIncidents')}
              checked={filters.isStudentIncident === 'true'}
              onChange={(e) => handleFilterChange('isStudentIncident', e.target.checked ? 'true' : '')}
            />
            <CFormCheck
              id="isOverdue"
              label={t('incident.filters.overdueOnly')}
              checked={filters.isOverdue === 'true'}
              onChange={(e) => handleFilterChange('isOverdue', e.target.checked ? 'true' : '')}
            />
            <CFormCheck
              id="requiresBPJSReporting"
              label={t('incident.filters.requiresBPJS')}
              checked={filters.requiresBPJSReporting === 'true'}
              onChange={(e) => handleFilterChange('requiresBPJSReporting', e.target.checked ? 'true' : '')}
            />
            <CFormCheck
              id="requiresMedicalAttention"
              label={t('incident.filters.requiresMedical')}
              checked={filters.requiresMedicalAttention === 'true'}
              onChange={(e) => handleFilterChange('requiresMedicalAttention', e.target.checked ? 'true' : '')}
            />
          </div>

          {/* Filter Actions */}
          <div className="d-grid gap-2">
            <CButton color="primary" onClick={() => loadIncidents()}>
              <CIcon icon={cilSearch} className="me-2" />
              {t('incident.filters.apply')}
            </CButton>
            <CButton color="secondary" variant="outline" onClick={clearFilters}>
              <CIcon icon={cilX} className="me-2" />
              {t('incident.filters.clear')}
            </CButton>
          </div>
        </div>
      </COffcanvasBody>
    </COffcanvas>
  );

  // Render incident row
  const renderIncidentRow = (incident: IncidentListItem) => (
    <CTableRow key={incident.id} className={incident.isUrgent ? 'table-danger' : ''}>
      <CTableDataCell>
        <CFormCheck
          checked={selectedIncidents.includes(incident.id)}
          onChange={(e) => handleSelectIncident(incident.id, e.target.checked)}
        />
      </CTableDataCell>
      <CTableDataCell>
        <div className="fw-semibold">
          {incident.incidentNumber}
          {incident.isAnonymous && (
            <CTooltip content={t('incident.anonymous.tracking', { code: incident.anonymousTrackingCode })}>
              <CBadge color="secondary" className="ms-1">A</CBadge>
            </CTooltip>
          )}
        </div>
        <small className="text-muted">
          {format(parseISO(incident.incidentDateTime), 'dd/MM/yyyy HH:mm')}
        </small>
      </CTableDataCell>
      <CTableDataCell>
        <div className="text-truncate" style={{ maxWidth: '300px' }}>
          <CTooltip content={incident.description}>
            <span className="fw-medium">{incident.title}</span>
          </CTooltip>
        </div>
        <div className="d-flex gap-1 mt-1">
          <CBadge color="light" textColor="dark">
            <CIcon icon={cilLocationPin} size="sm" className="me-1" />
            {incident.building} - {incident.location}
          </CBadge>
          {incident.isStudentIncident && (
            <CBadge color="info">
              <CIcon icon={cilUser} size="sm" className="me-1" />
              {t('incident.student')}
            </CBadge>
          )}
        </div>
      </CTableDataCell>
      <CTableDataCell>
        <CBadge color={getSeverityColor(incident.severity)}>
          {incident.severityDisplay}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <div>
          <CBadge color={getStatusColor(incident.status)}>
            {incident.statusDisplay}
          </CBadge>
        </div>
        {incident.investigationStatus && (
          <div className="mt-1">
            <CBadge color={getInvestigationStatusColor(incident.investigationStatus)} textColor="white">
              <CIcon icon={cilMagnifyingGlass} size="sm" className="me-1" />
              {incident.investigationStatusDisplay}
            </CBadge>
          </div>
        )}
      </CTableDataCell>
      <CTableDataCell>
        <div className="d-flex flex-column gap-1">
          {incident.requiresBPJSReporting && (
            <CTooltip content={incident.bpjsReferenceNumber || t('incident.compliance.bpjsPending')}>
              <CBadge color={incident.bpjsReferenceNumber ? 'success' : 'warning'}>
                BPJS {incident.bpjsReferenceNumber ? '✓' : '!'}
              </CBadge>
            </CTooltip>
          )}
          {incident.requiresMinistryReporting && (
            <CTooltip content={incident.ministryReferenceNumber || t('incident.compliance.ministryPending')}>
              <CBadge color={incident.ministryReferenceNumber ? 'success' : 'warning'}>
                Ministry {incident.ministryReferenceNumber ? '✓' : '!'}
              </CBadge>
            </CTooltip>
          )}
          {incident.isRegulatoryOverdue && (
            <CBadge color="danger">
              <CIcon icon={cilClock} size="sm" className="me-1" />
              {t('incident.compliance.overdue')}
            </CBadge>
          )}
        </div>
      </CTableDataCell>
      <CTableDataCell>
        <div>
          {incident.personAffectedName || '-'}
          {incident.personAffectedClass && (
            <div className="small text-muted">{incident.personAffectedClass}</div>
          )}
        </div>
        {incident.parentNotified && (
          <CBadge color="success" className="mt-1">
            <CIcon icon={cilCheckCircle} size="sm" className="me-1" />
            {t('incident.parent.notified')}
          </CBadge>
        )}
      </CTableDataCell>
      <CTableDataCell>
        <div className="small">
          <div>{incident.reportedBy}</div>
          <div className="text-muted">{incident.reporterTypeDisplay}</div>
        </div>
      </CTableDataCell>
      <CTableDataCell>
        <div className="d-flex gap-1">
          <CTooltip content={t('incident.actions.view')}>
            <CButton
              color="primary"
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/incidents/${incident.id}`)}
            >
              <CIcon icon={cilInfo} />
            </CButton>
          </CTooltip>
          <CTooltip content={t('incident.actions.edit')}>
            <CButton
              color="info"
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/incidents/${incident.id}/edit`)}
            >
              <CIcon icon={cilPencil} />
            </CButton>
          </CTooltip>
          {incident.investigationStatus === 'NotStarted' && (
            <CTooltip content={t('incident.actions.investigate')}>
              <CButton
                color="warning"
                size="sm"
                variant="ghost"
                onClick={() => navigate(`/incidents/${incident.id}/investigate`)}
              >
                <CIcon icon={cilMagnifyingGlass} />
              </CButton>
            </CTooltip>
          )}
        </div>
      </CTableDataCell>
    </CTableRow>
  );

  return (
    <CContainer fluid>
      {/* Page Header */}
      <CRow className="mb-4">
        <CCol>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>{t('incident.list.title')}</h2>
              <p className="text-muted mb-0">
                {t('incident.list.subtitle', { count: totalItems })}
                {lastRefresh && (
                  <span className="ms-2">
                    • {t('incident.list.lastUpdate')}: {format(lastRefresh, 'HH:mm:ss')}
                  </span>
                )}
              </p>
            </div>
            <div className="d-flex gap-2">
              <CButton
                color="primary"
                onClick={() => navigate('/incidents/new')}
              >
                <CIcon icon={cilPlus} className="me-2" />
                {t('incident.actions.report')}
              </CButton>
              <CDropdown>
                <CDropdownToggle color="secondary" disabled={exportLoading}>
                  {exportLoading ? (
                    <CSpinner size="sm" />
                  ) : (
                    <CIcon icon={cilCloudDownload} className="me-2" />
                  )}
                  {t('incident.actions.export')}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => handleExport('excel')}>
                    <CIcon icon={cilCloudDownload} className="me-2" />
                    {t('incident.export.excel')}
                  </CDropdownItem>
                  <CDropdownItem onClick={() => handleExport('csv')}>
                    <CIcon icon={cilCloudDownload} className="me-2" />
                    {t('incident.export.csv')}
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem onClick={() => window.print()}>
                    <CIcon icon={cilPrint} className="me-2" />
                    {t('incident.export.print')}
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Statistics */}
      {renderStatistics()}

      {/* Main Content */}
      <CCard>
        <CCardHeader>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                active={activeTab === 'list'}
                onClick={() => setActiveTab('list')}
              >
                <CIcon icon={cilList} className="me-2" />
                {t('incident.tabs.list')}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
              >
                <CIcon icon={cilChartPie} className="me-2" />
                {t('incident.tabs.analytics')}
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 'list'}>
              {/* Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2 align-items-center">
                  <CInputGroup style={{ width: '300px' }}>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder={t('incident.search.placeholder')}
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                  </CInputGroup>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => setShowFilters(true)}
                  >
                    <CIcon icon={cilFilter} className="me-2" />
                    {t('incident.filters.button')}
                    {activeFiltersCount > 0 && (
                      <CBadge color="danger" className="ms-2" shape="rounded-pill">
                        {activeFiltersCount}
                      </CBadge>
                    )}
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() => loadIncidents()}
                  >
                    <CIcon icon={cilReload} />
                  </CButton>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <CFormSelect
                    style={{ width: 'auto' }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10 {t('common.perPage')}</option>
                    <option value="20">20 {t('common.perPage')}</option>
                    <option value="50">50 {t('common.perPage')}</option>
                    <option value="100">100 {t('common.perPage')}</option>
                  </CFormSelect>
                  <CFormSelect
                    style={{ width: 'auto' }}
                    value={refreshInterval?.toString() || 'manual'}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRefreshInterval(value === 'manual' ? null : Number(value));
                    }}
                  >
                    <option value="manual">{t('incident.refresh.manual')}</option>
                    <option value="30000">{t('incident.refresh.30s')}</option>
                    <option value="60000">{t('incident.refresh.1m')}</option>
                    <option value="300000">{t('incident.refresh.5m')}</option>
                  </CFormSelect>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <CCallout color="info" className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{t('incident.filters.active', { count: activeFiltersCount })}</strong>
                      <div className="mt-1">
                        {Object.entries(filters).map(([key, value]) => {
                          if (!value) return null;
                          return (
                            <CBadge key={key} color="info" className="me-2 mb-1">
                              {t(`incident.filters.${key}`)}: {value}
                            </CBadge>
                          );
                        })}
                      </div>
                    </div>
                    <CButton
                      color="info"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                    >
                      {t('incident.filters.clearAll')}
                    </CButton>
                  </div>
                </CCallout>
              )}

              {/* Data Table */}
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner color="primary" />
                  <div className="mt-2">{t('common.loading')}</div>
                </div>
              ) : incidents.length === 0 ? (
                <CAlert color="info">
                  <CIcon icon={cilInfo} className="me-2" />
                  {activeFiltersCount > 0
                    ? t('incident.list.noResultsWithFilters')
                    : t('incident.list.noIncidents')}
                </CAlert>
              ) : (
                <>
                  <div className="table-responsive">
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell style={{ width: '40px' }}>
                            <CFormCheck
                              checked={selectedIncidents.length === incidents.length && incidents.length > 0}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            style={{ cursor: 'pointer', width: '120px' }}
                            onClick={() => handleSort('incidentNumber')}
                          >
                            {t('incident.fields.number')}
                            {sortBy === 'incidentNumber' && (
                              <CIcon
                                icon={sortDirection === 'asc' ? cilArrowThickFromBottom : cilArrowThickFromTop}
                                size="sm"
                                className="ms-1"
                              />
                            )}
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('title')}
                          >
                            {t('incident.fields.title')}
                            {sortBy === 'title' && (
                              <CIcon
                                icon={sortDirection === 'asc' ? cilArrowThickFromBottom : cilArrowThickFromTop}
                                size="sm"
                                className="ms-1"
                              />
                            )}
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            style={{ cursor: 'pointer', width: '100px' }}
                            onClick={() => handleSort('severity')}
                          >
                            {t('incident.fields.severity')}
                            {sortBy === 'severity' && (
                              <CIcon
                                icon={sortDirection === 'asc' ? cilArrowThickFromBottom : cilArrowThickFromTop}
                                size="sm"
                                className="ms-1"
                              />
                            )}
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '150px' }}>
                            {t('incident.fields.status')}
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '140px' }}>
                            {t('incident.fields.compliance')}
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '150px' }}>
                            {t('incident.fields.personAffected')}
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '120px' }}>
                            {t('incident.fields.reportedBy')}
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '120px' }}>
                            {t('common.actions')}
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {incidents.map(renderIncidentRow)}
                      </CTableBody>
                    </CTable>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">
                        {t('common.showing', {
                          from: (currentPage - 1) * pageSize + 1,
                          to: Math.min(currentPage * pageSize, totalItems),
                          total: totalItems,
                        })}
                      </div>
                      <CPagination>
                        <CPaginationItem
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(1)}
                        >
                          {t('common.first')}
                        </CPaginationItem>
                        <CPaginationItem
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                          {t('common.previous')}
                        </CPaginationItem>
                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                          const pageNumber = currentPage - 2 + index;
                          if (pageNumber < 1 || pageNumber > totalPages) return null;
                          return (
                            <CPaginationItem
                              key={pageNumber}
                              active={pageNumber === currentPage}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </CPaginationItem>
                          );
                        })}
                        <CPaginationItem
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                          {t('common.next')}
                        </CPaginationItem>
                        <CPaginationItem
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {t('common.last')}
                        </CPaginationItem>
                      </CPagination>
                    </div>
                  )}
                </>
              )}

              {/* Bulk Actions */}
              {selectedIncidents.length > 0 && (
                <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
                  <CCard className="shadow-lg">
                    <CCardBody className="py-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="text-muted">
                          {t('incident.bulk.selected', { count: selectedIncidents.length })}
                        </span>
                        <CButtonGroup>
                          <CButton color="primary" size="sm">
                            <CIcon icon={cilCheckCircle} className="me-1" />
                            {t('incident.bulk.assign')}
                          </CButton>
                          <CButton color="warning" size="sm">
                            <CIcon icon={cilMagnifyingGlass} className="me-1" />
                            {t('incident.bulk.investigate')}
                          </CButton>
                          <CButton color="danger" size="sm">
                            <CIcon icon={cilBan} className="me-1" />
                            {t('incident.bulk.close')}
                          </CButton>
                        </CButtonGroup>
                      </div>
                    </CCardBody>
                  </CCard>
                </div>
              )}
            </CTabPane>

            {/* Analytics Tab */}
            <CTabPane visible={activeTab === 'analytics'}>
              {statistics && (
                <CRow>
                  <CCol md={6}>
                    <CCard className="mb-4">
                      <CCardHeader>{t('incident.analytics.byCategory')}</CCardHeader>
                      <CCardBody>
                        {/* Category breakdown chart would go here */}
                        <CAlert color="info">
                          {t('incident.analytics.chartPlaceholder')}
                        </CAlert>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md={6}>
                    <CCard className="mb-4">
                      <CCardHeader>{t('incident.analytics.byLocation')}</CCardHeader>
                      <CCardBody>
                        {/* Location breakdown chart would go here */}
                        <CAlert color="info">
                          {t('incident.analytics.chartPlaceholder')}
                        </CAlert>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md={12}>
                    <CCard>
                      <CCardHeader>{t('incident.analytics.trends')}</CCardHeader>
                      <CCardBody>
                        {/* Trend chart would go here */}
                        <CAlert color="info">
                          {t('incident.analytics.chartPlaceholder')}
                        </CAlert>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              )}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Filters Sidebar */}
      {renderFilters()}
    </CContainer>
  );
};

export default IncidentListEnhanced;